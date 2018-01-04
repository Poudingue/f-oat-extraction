#Transformation en nouveau type de xml des infos serveur
#Certaines variables doivent encore être déterminées à la main :

import os, sys

name = sys.argv[1]
filetype = sys.argv[2]

#En-tête : À l'heure actuelle non modifié
file_intro = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<root>\n"
file_intro+="\t<version>0.4</version>\n\t<project path=\""+name+"."+filetype+"\">\n\t</project>\n"

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
tab_sho = tex2tab(name+"_shots.txt")
tab_sce = tex2tab(name+"_scenes.txt")

#Beginings et Endings de shots
sho_beg, sho_end = [], []
#Beginings et Endings de scenes
sce_beg, sce_end = [], []
#set de frames «intéressantes» (on évite les duplicatas avec set)
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


#génération du texte pour les scènes
body = "\t<scenes>\n"
for it_sce in range(nb_sce):
	body += "\t\t<Scene startFrame=\""+str(sce_beg[it_sce])+"\" endFrame=\""+str(sce_end[it_sce])+"\">\n"
	#Renseigner ici des infos complémentaires sur la scène
	for it_sho in range(nb_sho):
		#Si un shot est inclus dans la scècne actuelle, on l'ajoute et on augmente order
		if(sho_beg[it_sho]>=sce_beg[it_sce] and sho_end[it_sho]<=sce_end[it_sce]):
			body += ("\t\t\t<shot startFrame=\""+str(sho_beg[it_sho])+"\" endFrame=\""+str(sho_end[it_sho])+"\">\n")
			#On est dans un shot, on peut renseigner des infos complémentaires sur le shot
			for fra in fra_set:
				if fra>=sho_beg[it_sho] and fra<=sho_end[it_sho]:
					body+="\t\t\t\t<frame timeId=\""+fra+"\">\n"
					#C'est ici qu'on injecterait des infos à l'échelle de la frame
					body+="Info 1, 2, 3…"
					body+="\t\t\t\t</frame>\n"
			body += ("\t\t\t</shot>\n")
	body += "\t\t</Scene>\n"
body +="\t</scenes>\n"

frames=""#Overload

#Print de la concaténation des parties
#print(file_intro+header+body+"</root>")
text_file = open(name+".xml", "w")
text_file.write(file_intro+header+body+"</root>")
text_file.close()
