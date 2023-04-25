#!/bin/env bash

# Angular build
ng build --configuration production

# Podman build
podman build -t localhost:5001/built-frontend:latest .

# Podman push
podman push --tls-verify=false localhost:5001/built-frontend:latest

# Apply Kubernetes resources
#kubectl apply -f k8s/
