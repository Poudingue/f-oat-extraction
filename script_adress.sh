#!/bin/sh
#cette version récupère une adrdess pour le fichier, et l'id du projet

if [ $# < 2 ];then
  echo "Arguments : http adress of the file and project id"
  exit 0
else
  url=$1
  idprojet=$2
  file=`basename "$url"`
  wget "$url" -O "$file"
  extension=$2 #Récupérer l'extension et le nom auto
  echo "Lancement de l'extraction"
  ./video_segmentation $file
  echo "extrait"
  python3 gen_v5.py $file
  echo "xml généré"
  exec ./expediteur.sh $idprojet &
fi
echo "Arrêt du script"
