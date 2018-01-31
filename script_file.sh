#!/bin/sh
#Cette version récupère un fichier et l'id du projet

if [ $# < 2 ];then
   echo "Argument : place and name of the file and project id"
   exit 0
else
   file=$1
   idprojet=$2
   echo "Lancement de l'extraction"
   ./video_segmentation $file
   echo "extrait"
   python3 gen_v5.py $file
   echo "xml généré"
   exec ./expediteur.sh $idprojet &
fi
echo "Arrêt du script"
