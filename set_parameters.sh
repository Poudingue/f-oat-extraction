#!/bin/sh

if [ $# != 2 ];then
   echo "Argument 1 : project id, Argument 2 : string with parameters"
   exit 0
else
   id=$1
   params=$2
   echo $2 > projects/$1/parameters
fi
