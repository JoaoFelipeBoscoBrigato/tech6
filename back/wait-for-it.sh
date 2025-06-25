#!/usr/bin/env sh
# Use this script to test if a given TCP host/port are available

set -e

TIMEOUT=15
STRICT=0
QUIET=0
HOST=""
PORT=""
CMD=""

print_usage() {
    echo "Usage: $0 host:port [-s] [-t timeout] [-- command args]"
}

log() {
    if [ "$QUIET" -ne 1 ]; then
        echo "$@"
    fi
}

while [ $# -gt 0 ]
do
    case "$1" in
        *:*)
            HOST=$(echo $1 | cut -d: -f1)
            PORT=$(echo $1 | cut -d: -f2)
            shift 1
            ;;
        -h|--host)
            HOST="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -s|--strict)
            STRICT=1
            shift 1
            ;;
        -q|--quiet)
            QUIET=1
            shift 1
            ;;
        --)
            shift
            CMD="$@"
            break
            ;;
        *)
            print_usage
            exit 1
            ;;
    esac
done

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
    print_usage
    exit 1
fi

log "Waiting for $HOST:$PORT..."

for i in $(seq $TIMEOUT)
do
    nc -z $HOST $PORT > /dev/null 2>&1 && break
    sleep 1
done

if [ $i -eq $TIMEOUT ]; then
    log "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
    if [ $STRICT -eq 1 ]; then
        exit 1
    fi
fi

if [ -n "$CMD" ]; then
    exec $CMD
fi
