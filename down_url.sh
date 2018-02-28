#!/bin/sh
#Downloader from url in folder "id"
if [ $# != 2 ];then
   echo "First argument : project id. Second : url adress"
   exit 0
else
   mkdir "projects/$1"
   echo "" > "projects/$1/parameters"
   filename=`basename "$2"`
   extension="${filename##*.}"
   wget -O "projects/$1/video.$extension" "$2"
fi
#done
