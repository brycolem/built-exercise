terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.5.1"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.13.2"
    }
  }
}

# Configure the Kubernetes provider
provider "kubernetes" {
  config_path    = file("/home/brycolem/.kube/config")
  config_context = "rancher-desktop"
}

resource "kubectl_manifest" "config_map" {
  yaml_body = <<YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: built-demo
data:
  nginx.conf: |
    server {
      listen 3087;
      server_name localhost;

      location / {
        root /usr/share/nginx/html;
        index index.html;
        autoindex on;
      }

      location /api/v1/ {
        proxy_pass http://article-backend:8080/api/v1/;
      }
    }
YAML
}

resource "kubectl_manifest" "deployment" {
  depends_on = [kubectl_manifest.config_map]
  yaml_body  = <<YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: built-frontend
  namespace: built-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: built-frontend
  template:
    metadata:
      labels:
        app: built-frontend
    spec:
      containers:
        - name: built-frontend
          image: localhost:5001/built-frontend:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 3087
          volumeMounts:
            - name: nginx-config
              mountPath: /etc/nginx/conf.d
      volumes:
        - name: nginx-config
          configMap:
            name: nginx-config
YAML
}

resource "kubectl_manifest" "service" {
  depends_on = [kubectl_manifest.deployment]
  yaml_body  = <<YAML
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: built-demo
spec:
  selector:
    app: built-frontend
  ports:
    - port: 3087
      targetPort: 3087
  type: LoadBalancer
YAML
}
