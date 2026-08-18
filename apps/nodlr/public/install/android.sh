#!/data/data/com.termux/files/usr/bin/bash
set -e

# Wnode Headless Node Installer for Termux (Android)

if [ -z "$1" ]; then
  echo "Usage: curl -s <url> | bash -s <registration_token>"
  exit 1
fi

TOKEN=$1
VERSION="v1.0.0"
OS="android"
ARCH=$(uname -m)

if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="arm64"
else
    echo "Unsupported architecture for Android: $ARCH"
    exit 1
fi

BINARY_NAME="nodl-core-android-${ARCH}"
DOWNLOAD_URL="https://github.com/wnodeltd/wnode/releases/download/${VERSION}/${BINARY_NAME}"

INSTALL_DIR="$PREFIX/opt/wnode"
BIN_DIR="$PREFIX/bin"
CONFIG_DIR="$HOME/.wnode"

echo "Downloading Wnode Headless Node Operator ($ARCH)..."
mkdir -p $INSTALL_DIR
mkdir -p $CONFIG_DIR
curl -L -o ${INSTALL_DIR}/nodl-core $DOWNLOAD_URL
chmod +x ${INSTALL_DIR}/nodl-core
ln -sf ${INSTALL_DIR}/nodl-core ${BIN_DIR}/nodl-core

echo "Writing registration token..."
echo "$TOKEN" > ${CONFIG_DIR}/token
chmod 600 ${CONFIG_DIR}/token

echo "Creating Termux service..."
mkdir -p $PREFIX/var/service/wnode-no/log
mkdir -p $PREFIX/var/log/wnode-no
cat <<EOF > $PREFIX/var/service/wnode-no/run
#!/data/data/com.termux/files/usr/bin/bash
exec ${BIN_DIR}/nodl-core --profile=earth-headless 2>&1
EOF
chmod +x $PREFIX/var/service/wnode-no/run

cat <<EOF > $PREFIX/var/service/wnode-no/log/run
#!/data/data/com.termux/files/usr/bin/bash
exec svlogd -tt $PREFIX/var/log/wnode-no
EOF
chmod +x $PREFIX/var/service/wnode-no/log/run

echo "Starting service..."
sv up wnode-no || true

echo "Installation complete. Service 'wnode-no' is running via Termux Services."
