#!/bin/sh
#Launch extraction on

if [ $# != 1 ];then
   echo "Argument : project id"
   exit 0
else
   echo "id : $1"
   id=$1
   params=`cat projects/$1/parameters`
   echo "params : "$params
   echo "Lancement de l'extraction"
   ./video_segmentation "projects/$1/video.mp4" $params
   echo "extrait"
   python3 gen_v5.py $1/video
fi
echo "Arrêt du script"
