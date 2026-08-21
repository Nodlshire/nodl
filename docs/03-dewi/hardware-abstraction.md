# Hardware Abstraction Layer (HAL) for Radio Gateways

The DeWi HAL decouples radio transceiver chipsets (SX1250, SX1302, QCA9984) from higher-level telemetry routing.

```c
typedef struct {
    uint32_t frequency;
    uint8_t  bandwidth;
    uint8_t  spreading_factor;
    int8_t   rssi;
    float    snr;
} radio_packet_t;
```
