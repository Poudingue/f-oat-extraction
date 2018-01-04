#Essai de fonction générale pour la transformation des fichiers en xml
#Certaines variables doivent encore être déterminées à la main :

path = "E:\\NewInsight\\Externals\\data\\shining"
icon_path="Icons"
video_path="Shining.mp4"

#En-tête avec infos à récupérer (Je sais, c'est moche, mais pas trop le choix.)
file_intro = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<root>\n"
file_intro+="\t<version>0.1</version>\n\t<project path=\""+path+"\">\n\t\t<icons path=\""+icon_path+"\"/>\n"
file_intro+="\t\t<video id=\"1\" path=\""+video_path+"\"/>\n\t</project>\n"

#header. Remplissage à faire
header="\t<header>\n"
header+="\t\tINFOS À RAJOUTER\n"
header+="\n\t</header>\n"


#Extraction des listes de numéro de frame vers un tableau de tableaux
def tex2tab(name):
	file = open(name, "r")
	tab_shots=[]
	nblines=0
	for line in file:
		ligne=line.rstrip()
		word=""
		i_word=0
		tab_line=[]
		for c in ligne:
			if c == " ":
				if(word!="0"): #Filtrage des valeurs 0 qui sont des valeurs non trouvées
					tab_line.append(word)
					i_word+=1
				word=""
			else: word+=c
		if(word!="" and word!="0"): tab_line.append(word)
		tab_shots.append(tab_line)
		nblines+=1
	return tab_shots

#Extraction dans des tableaux :
tab_sho = tex2tab("Shining_shots.txt")
tab_sce = tex2tab("Shining_scenes.txt")

#Beginings et Endings de shots
sho_beg, sho_end = [], []
#Beginings et Endings de scenes
sce_beg, sce_end = [], []
#set de frames «intéressantes» (on évite les duplicatas de scènes intéressantes entre shots et scenes)
fra_set = set()
#Remplissage des tableaux
for line in tab_sho:
	sho_beg.append(line[0])
	sho_end.append(line[1])
	for it in range(2, len(line)): fra_set.add(line[it])
	
for line in tab_sce:
	sce_beg.append(line[0])
	sce_end.append(line[1])
	for it in range(2, len(line)): fra_set.add(line[it])


nb_sho, nb_sce=len(tab_sho), len(tab_sce)

#génération du texte pour les frames d'intérêt
#TODO numérotation de frames. Je pense pas que l'ordre soit important
frames = "\t<frames>\n"
fra_id=0
for fra in fra_set:
	frames+="\t\t<frame id=\""+str(fra_id)+"\" refVideo=\"1\" timeId=\""+fra+"\">\n"
	frames+="\t\t</frame>\n"
	fra_id+=1
frames+="\t</frames>\n"

shots = "\t<shots>\n"
#génération du texte pour les shots
for it in range(nb_sho):
	shots += ("\t\t<shot endFrame=\""+str(sho_end[it])+"\" id=\""+str(it+1)+"\" startFrame=\""+str(sho_beg[it])+"\">\n")
	shots += ("\t\t</shot>\n")
shots+="\t</shots>\n"

#génération du texte pour les scŝnes
scenes = "\t<scenes>\n"
for it_sce in range(nb_sce):
	order=0
	scenes += "\t\t<Scene id=\""+str(it_sce+1)+"\">\n"
	for it_sho in range(nb_sho):
		#Si un shot est inclus dans la scècne actuelle, on l'ajoute et on augmente order
		if(sho_beg[it_sho]>=sce_beg[it_sce] and sho_end[it_sho]<=sce_end[it_sce]):
			scenes += "\t\t\t<shot order=\""+str(order)+"\" refId=\""+str(it_sho+1)+"\"/>\n"
			order+=1
	scenes += "\t\t</Scene>\n"

scenes +="\t</scenes>\n"

frames=""#Overload

#Print de la concaténation des parties
print(file_intro+header+frames+shots+scenes+"</root>")
