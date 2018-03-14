#!/bin/sh

if [ $# != 2 ];then
   echo "Argument 1 : project id, Argument 2 : string with parameters"
   exit 0
else
   id=$1
   params=$2

   # Si le projet est dans les projets supprimables, on l'en enleve
   rm -f "deletable_projects/$id"
   mkdir -p "projects/$1"
   echo " $2" > projects/$1/parameters
fi
