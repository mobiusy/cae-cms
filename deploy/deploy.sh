kubectl apply -f namespace.yaml
kubectl apply -f storage-class.yaml
kubectl apply -f deploy-redis.yaml
kubectl apply -f deploy-postgres.yaml
kubectl apply -f deploy-minio.yaml
kubectl apply -f deploy-cae-cms.yaml