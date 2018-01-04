#Essai de fonction générale pour la transformation des fichiers en xml
#Certaines variables doivent encore être déterminées à la main :

path = "E:\\NewInsight\\Externals\\data\\shining"
icon_path="Icons"
video_path="Shining.mp4"

#En-tête avec infos à récupérer (Je sais, c'est moche, mais pas trop le choix.)
file_intro = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<root>\n"
file_intro+="\t<version>0.1</version>\n\t<project path=\""+path+"\">\n\t\t<icons path=\""+icon_path+"\"/>\n\t\t<video id=\"1\" path=\""+video_path+"\"/>\n\t</project>\n"

#header. Infos indisponibles sur les fichiers fournis
header="\t<header>\n\t\tPARTIE À REMPLIR\n\t</header>\n"

#TODO partie  sur les frames. (Liste de frames pertinentes avec détail)
frames = "\t<frames>\n\t\tPARTIE À REMPLIR\n\t</frames>\n"

#Extraction des listes de numéro de frame vers un tableau de tableaux
def text_to_table(name):
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
			else :
				word+=c
		if(word!=""):
			tab_line.append(word)
		tab_shots.append(tab_line)
		nblines+=1
	return tab_shots

#Extraction dans des tableau utilisables
#(Accès : index de numéro de ligne.
# Dans le tableau obtenu : index de numéro de nombre dans la ligne
tab_shots = text_to_table("Shining_shots.txt")
tab_scenes = text_to_table("Shining_scenes.txt")

print(tab_shots)
print(tab_scenes)

nblines=len(tab_shots)
shots = "\t<shots>\n"

#génération du texte pour shots
#it pour le numéro de ligne, 0 et 1 pour premier et deuxième nombre,
#correspondant à la première et dernière frame
for it in range(nblines):
	shots += ("\t\t<shot endFrame=\""+tab_shots[it][1]+"\" id=\""+str(it+1)+"\" startFrame=\""+tab_shots[it][0]+"\">\n\t\t</shot>\n")
	#TODO : Récupérer les frames «pertinentes» dans le tableau de shots et de scenes (Les colonnes >1)
shots+="\t</shots>\n"

#Liste des scènes : fait des références à des shots, c'est un peu le bordel
#TODO: scenes
scenes = "\t<scenes>\n\t\tPARTIE À REMPLIR\n\t</scenes>\n"

#Print de la concaténation des parties
print(file_intro+header+frames+shots+scenes+"</root>")
