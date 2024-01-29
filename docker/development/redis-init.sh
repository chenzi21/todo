# iptables --policy INPUT DROP
# iptables --policy OUTPUT DROP
# iptables --policy FORWARD DROP
# iptables -A INPUT -s app -p tcp --dport 3000 -j ACCEPT
# iptables -A INPUT -s app -p tcp --dport 3000 -j ACCEPT

# redis-server /usr/local/etc/redis/redis.conf

echo fuck