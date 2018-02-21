#!/bin/sh
#Launch extraction on

if [ $# != 1 ];then
   echo "Argument : project id"
   exit 0
else
   id=$1
   params=`cat $1/parameters`
   echo $params
   echo "Lancement de l'extraction"
   ./video_segmentation video $params
   echo "extrait"
   python3 gen_v5.py $file
   echo "xml généré"
   exec ./expediteur.sh $idprojet &
fi
echo "Arrêt du script"
