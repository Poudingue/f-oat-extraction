#!/bin/sh
if [ $# != 2 ];then
  echo "Premier argument : filename. Second : extension"
  exit 0
else
  file=$1
  extension=$2
  echo "Lancement de l'extraction"
  ./video_segmentation $file.$extension
  echo "extrait"
  python3 gen_v4.py $file $extension
  echo "xml généré"
fi
echo "Arrêt du script"
