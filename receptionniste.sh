#!/bin/sh
#Processus

while :
do
   #Attente du backend pour un message
   message = "id projet et checksum ou url de video"
   idproj = "93849187"
   #Créer le dossier de projet et aller dedans.
   mkdir "$idproj"
   cd "$idproj"
   echo '' > projet.lock
   cd ".."
   #Si c'est une url qui est donnée :
   if [messageisurl];then
      ./script_adress_auto.sh "$url"
   else
      if [messageischecksum];then
         cd videos
         if [-f checksum]; then
            exec ./script_file.sh "$idproj" &
         else
            exec ./downloader.sh "$idproj" &
         fi
      else
         echo "exception, handle"
      fi
   fi
   cd ..
   echo "lel"
done
