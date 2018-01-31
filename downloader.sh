#!/bin/sh
#Downloader

#Envoi d'une requête pour fichier au backend avec id du projet $1
#Réception
exec ./script_file.sh "$1" &
#done
