#!/bin/sh
#Launch extraction on

if [ $# != 1 ];then
   echo "Argument : project id"
   exit 0
else
   id=$1
   params=`cat $1/parameters`
   echo "params : "$params
   echo "Lancement de l'extraction"
   ./video_segmentation "42/video" $params
   echo "extrait"
   python3 gen_v5.py $1/video
fi
echo "Arrêt du script"
