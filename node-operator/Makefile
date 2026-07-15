.PHONY: all build-linux build-darwin build-windows clean package

VERSION ?= 1.0.0

all: build-linux build-darwin build-windows package

build-linux:
	@echo "Building for Linux (amd64 and arm64)..."
	@mkdir -p builds/linux-amd64 builds/linux-arm64
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w -buildid= -X main.Version=${VERSION}" -o builds/linux-amd64/nodl-core core/cmd/nodl-core/main.go
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags="-s -w -buildid= -X main.Version=${VERSION}" -o builds/linux-arm64/nodl-core core/cmd/nodl-core/main.go
	cp installer/linux/nodl-core.service builds/linux-amd64/
	cp installer/linux/install_linux.sh builds/linux-amd64/
	cp installer/linux/nodl-core.service builds/linux-arm64/
	cp installer/linux/install_linux.sh builds/linux-arm64/

build-darwin:
	@echo "Building for macOS (amd64 and arm64)..."
	@mkdir -p builds/darwin-amd64 builds/darwin-arm64
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -trimpath -ldflags="-s -w -buildid= -X main.Version=${VERSION}" -o builds/darwin-amd64/nodl-core core/cmd/nodl-core/main.go
	CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -trimpath -ldflags="-s -w -buildid= -X main.Version=${VERSION}" -o builds/darwin-arm64/nodl-core core/cmd/nodl-core/main.go
	cp installer/macos/com.nodl.core.plist builds/darwin-amd64/
	cp installer/macos/install_macos.sh builds/darwin-amd64/
	cp installer/macos/com.nodl.core.plist builds/darwin-arm64/
	cp installer/macos/install_macos.sh builds/darwin-arm64/

build-windows:
	@echo "Building for Windows (amd64)..."
	@mkdir -p builds/windows-amd64
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -trimpath -ldflags="-s -w -buildid= -X main.Version=${VERSION}" -o builds/windows-amd64/nodl-core.exe core/cmd/nodl-core/main.go
	cp installer/windows/winsw.xml builds/windows-amd64/
	cp installer/windows/install_windows.ps1 builds/windows-amd64/
	# Create a dummy winsw.exe for testing since we don't have it downloaded
	touch builds/windows-amd64/winsw.exe

package:
	@echo "Packaging releases..."
	cd builds/linux-amd64 && tar -czvf ../wnode-operator-linux-amd64.tar.gz *
	cd builds/linux-arm64 && tar -czvf ../wnode-operator-linux-arm64.tar.gz *
	cd builds/darwin-amd64 && tar -czvf ../wnode-operator-darwin-amd64.tar.gz *
	cd builds/darwin-arm64 && tar -czvf ../wnode-operator-darwin-arm64.tar.gz *
	cd builds/windows-amd64 && zip -r ../wnode-operator-windows-amd64.zip *
	cd builds && sha256sum *.tar.gz *.zip > checksums.txt

clean:
	rm -rf builds/
