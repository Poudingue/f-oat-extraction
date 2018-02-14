#!/bin/sh
#Downloader from url in folder "id"
if [ $# != 2 ];then
   echo "First argument : project id. Second : url adress"
   exit 0
else
   mkdir $1
   wget -O "projects/$1/video.mp4" "$2"
fi
#done
