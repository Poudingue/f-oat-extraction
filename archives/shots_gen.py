path = "E:\\NewInsight\\Externals\\data\\shining"
icon_path="Icons"
video_path="Shining.mp4"

#En-tête avec infos à récupérer
file_intro = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<root>\n"
file_intro+="\t<version>0.1</version>\n\t<project path=\""+path+"\">\n\t\t<icons path=\""+icon_path+"\"/>\n\t\t<video id=\"1\" path=\""+video_path+"\"/>\n\t</project>\n\t<header>\n\tPARTIE À REMPLIR\n\t</header>\n"

#TODO partie  sur les frames
frames = "\t<frames>\n\tPARTIE À REMPLIR\n\t</frames>\n"

#Shots ok
shots = "\t<shots>\n"
file = open("Shining_shots.txt", "r")
nbline=1
for line in file:
	ligne=line.rstrip()
	begining=""
	i=0
	while(ligne[i]!=" "):
		begining+=ligne[i]
		i+=1
	i+=1
	ending=""
	while(ligne[i]!=" "):
		ending+=ligne[i]
		i+=1
	shots += ("\t\t<shot endFrame=\""+ending+"\" id=\""+str(nbline)+"\" startFrame=\""+begining+"\">\n\t\t</shot>\n")
	nbline+=1
	#TODO : Récupérer les frames «pertinentes» tout en filtrant les 0
shots+="\t</shots>\n"

#TODO: scenes
scenes = "\t<scenes>\n\tPARTIE À REMPLIR\n\t</scenes>\n"

#Print de la concaténation des parties
print(file_intro+frames+shots+scenes+"</root>")
