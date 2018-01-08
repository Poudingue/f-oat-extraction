#!/bin/sh
#Variante : cette version récupère une adrdess pour le fichier, et en déduit automatiquement le nom de fichier et l'extension

if [ $# != 1 ];then
  echo "Argument : http adress of the file"
  exit 0
else
  url=$1
  file=`basename "$url"`
  wget "$url" -O "$file"
  extension=$2 #Récupérer l'extension et le nom auto
  echo "Lancement de l'extraction"
  ./video_segmentation $file
  echo "extrait"
  python3 gen_v5.py $file
  echo "xml généré"
fi
echo "Arrêt du script"
