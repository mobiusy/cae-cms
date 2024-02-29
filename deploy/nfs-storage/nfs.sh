sudo mkdir -p /data/nfs
sudo chmod 777 /data/nfs
sudo apt install -y nfs-kernel-server
sudo vim /etc/exports

# /data/nfs *(rw,sync,no_subtree_check,no_root_squash)
sudo exportfs -r
sudo exportfs

sudo systemctl restart rpcbind
sudo systemctl enable rpcbind
sudo systemctl restart nfs-server
sudo systemctl enable nfs-server