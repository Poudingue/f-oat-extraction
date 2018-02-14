#!/bin/sh
#Launch extraction on

if [ $# != 1 ];then
   echo "Argument : project id"
   exit 0
else
   echo "id : $1"
   id=$1
   params=$(head -n 1 projects/$1/parameters)
   echo "params : "$params
   echo "Lancement de l'extraction"
   echo "./video_segmentation projects/$1/video.mov $params"
  ./video_segmentation "projects/$1/video.mov $params"
   echo "extrait"
   python3 gen_v5.py projects/$1/video
fi
echo "Arrêt du script"
