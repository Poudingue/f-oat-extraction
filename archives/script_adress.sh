#!/bin/sh
#Variante : cette version récupère une adrdess pour le fichier et le télécharge

if [ $# != 3 ];then
  echo "Premier argument : filename. Second : extension. Third : http adress"
  exit 0
else
  wget $3
  file=$1
  extension=$2 #Récupérer l'extension et le nom auto
  echo "Lancement de l'extraction"
  ./video_segmentation $file.$extension
  echo "extrait"
  python3 gen_v4.py $file $extension
  echo "xml généré"
fi
echo "Arrêt du script"
