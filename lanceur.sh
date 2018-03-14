#!/bin/sh
#Launch extraction on

if [ $# != 1 ];then
    echo "Argument : project id"
    exit 0
else
    echo "id : $1"
    params=$(head -n 1 projects/$1/parameters)
    echo "Extraction launched…"
    ./video_segmentation projects/$1/video.*$params
    echo "Extracted"
    python3 gen_v5.py projects/$1/video
    echo "Converted to xml"
    echo "Done"
fi
