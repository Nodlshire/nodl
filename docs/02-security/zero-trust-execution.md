# Zero-Trust RAM Execution & Sandbox

Wnode treats all hardware operators as untrusted compute hosts.
* **No Root Access Required**: `nodld` operates under unprivileged user namespaces.
* **Syscall Restrict**: `seccomp-bpf` restricts process execution.
* **Transient RAM Namespace**: Jobs run inside dedicated `tmpfs` mounts unmounted upon task completion.
