package com.track2act.service;

import com.track2act.dto.request.CreateShipmentRequest;
import com.track2act.dto.request.UpdateShipmentRequest;
import com.track2act.dto.request.LocationUpdateRequest;
import com.track2act.dto.response.ShipmentDTO;
import com.track2act.dto.response.TrackingUpdateDTO;
import com.track2act.entity.Location;
import com.track2act.entity.Shipment;
import com.track2act.entity.TrackingUpdate;
import com.track2act.entity.User;
import com.track2act.repository.LocationRepository;
import com.track2act.repository.ShipmentRepository;
import com.track2act.repository.TrackingUpdateRepository;
import com.track2act.repository.UserRepository;
import com.track2act.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final TrackingUpdateRepository trackingUpdateRepository;

    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Integer computeProgress(Shipment shipment) {
        if (shipment.getOrigin() == null || shipment.getCurrentLatitude() == null || shipment.getCurrentLongitude() == null) {
            return 0;
        }
        Location origin = shipment.getOrigin();
        double distTotal = haversine(origin.getLatitude(), origin.getLongitude(),
                shipment.getDestination().getLatitude(), shipment.getDestination().getLongitude());
        if (distTotal == 0) return 0;
        double distCurrent = haversine(origin.getLatitude(), origin.getLongitude(),
                shipment.getCurrentLatitude(), shipment.getCurrentLongitude());
        double progress = (distCurrent / distTotal) * 100;
        return (int) Math.min(100, Math.max(0, progress));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(UUID.fromString(principal.getId()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<ShipmentDTO> getActiveShipments() {
        List<Shipment> active = shipmentRepository.findActiveShipments();
        return active.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ShipmentDTO> getShipmentsByDriver(UUID driverId) {
        return shipmentRepository.findByAssignedDriver_Id(driverId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ShipmentDTO> getShipmentsByCreator(UUID creatorId) {
        return shipmentRepository.findByCreatedBy_Id(creatorId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ShipmentDTO getById(UUID id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found: " + id));
        return toDTO(shipment);
    }

    public ShipmentDTO create(CreateShipmentRequest request) {
        User creator = getCurrentUser();
        
        Location origin = locationRepository.findById(request.getOriginId())
                .orElseThrow(() -> new IllegalArgumentException("Origin location not found"));
        Location destination = locationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new IllegalArgumentException("Destination location not found"));

        User assignedDriver = null;
        if (request.getAssignedDriverId() != null) {
            assignedDriver = userRepository.findById(request.getAssignedDriverId())
                    .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        }

        String trackingNumber = "TRK" + System.currentTimeMillis();

        Shipment shipment = Shipment.builder()
                .trackingNumber(trackingNumber)
                .cargoType(request.getCargoType())
                .cargoWeight(request.getCargoWeight())
                .cargoDescription(request.getCargoDescription())
                .origin(origin)
                .destination(destination)
                .assignedDriver(assignedDriver)
                .createdBy(creator)
                .status(Shipment.Status.PENDING)
                .estimatedArrival(request.getEstimatedArrival())
                .customerName(request.getCustomerName())
                .customerContact(request.getCustomerContact())
                .receiverName(request.getReceiverName())
                .receiverContact(request.getReceiverContact())
                .currentLatitude(origin.getLatitude())
                .currentLongitude(origin.getLongitude())
                .currentProgress(0)
                .build();

        Shipment saved = shipmentRepository.save(shipment);
        log.info("Created shipment: {} by user: {}", saved.getId(), creator.getId());
        return toDTO(saved);
    }

    public ShipmentDTO update(UUID id, UpdateShipmentRequest request) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found: " + id));

        if (request.getCargoType() != null) shipment.setCargoType(request.getCargoType());
        if (request.getCargoWeight() != null) shipment.setCargoWeight(request.getCargoWeight());
        if (request.getCargoDescription() != null) shipment.setCargoDescription(request.getCargoDescription());

        if (request.getOriginId() != null) {
            Location origin = locationRepository.findById(request.getOriginId())
                    .orElseThrow(() -> new IllegalArgumentException("Origin not found"));
            shipment.setOrigin(origin);
        }

        if (request.getDestinationId() != null) {
            Location destination = locationRepository.findById(request.getDestinationId())
                    .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
            shipment.setDestination(destination);
        }

        if (request.getAssignedDriverId() != null) {
            User driver = userRepository.findById(request.getAssignedDriverId())
                    .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
            shipment.setAssignedDriver(driver);
        }

        if (request.getCustomerName() != null) shipment.setCustomerName(request.getCustomerName());
        if (request.getCustomerContact() != null) shipment.setCustomerContact(request.getCustomerContact());
        if (request.getReceiverName() != null) shipment.setReceiverName(request.getReceiverName());
        if (request.getReceiverContact() != null) shipment.setReceiverContact(request.getReceiverContact());
        if (request.getEstimatedArrival() != null) shipment.setEstimatedArrival(request.getEstimatedArrival());

        if (request.getStatus() != null) {
            try {
                shipment.setStatus(Shipment.Status.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + request.getStatus());
            }
        }

        Shipment updated = shipmentRepository.save(shipment);
        log.info("Updated shipment: {}", updated.getId());
        return toDTO(updated);
    }

    public void delete(UUID id) {
        if (!shipmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Shipment not found: " + id);
        }
        shipmentRepository.deleteById(id);
        log.info("Deleted shipment: {}", id);
    }

    public ShipmentDTO updateLocation(LocationUpdateRequest request) {
        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found"));

        shipment.setCurrentLatitude(request.getLatitude());
        shipment.setCurrentLongitude(request.getLongitude());

        TrackingUpdate tracking = TrackingUpdate.builder()
                .shipment(shipment)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .statusNote(request.getStatusNote())
                .build();

        trackingUpdateRepository.save(tracking);

        shipment.setCurrentProgress(computeProgress(shipment));

        if (shipment.getStatus() == Shipment.Status.PENDING) {
            shipment.setStatus(Shipment.Status.IN_TRANSIT);
        }

        Shipment updated = shipmentRepository.save(shipment);
        log.info("Updated location for shipment: {}", updated.getId());
        return toDTO(updated);
    }

    public List<TrackingUpdateDTO> getTrackingHistory(UUID shipmentId) {
        return trackingUpdateRepository.findByShipment_IdOrderByTimestampDesc(shipmentId)
                .stream().map(t -> new TrackingUpdateDTO(t.getId(), t.getLatitude(), t.getLongitude(), t.getTimestamp(), t.getStatusNote()))
                .collect(Collectors.toList());
    }

    private ShipmentDTO toDTO(Shipment s) {
        List<TrackingUpdateDTO> history = getTrackingHistory(s.getId());
        
        return ShipmentDTO.builder()
                .id(s.getId())
                .trackingNumber(s.getTrackingNumber())
                .cargoType(s.getCargoType())
                .cargoWeight(s.getCargoWeight())
                .cargoDescription(s.getCargoDescription())
                .status(s.getStatus().name())
                .currentProgress(s.getCurrentProgress())
                .originName(s.getOrigin() != null ? s.getOrigin().getName() : null)
                .destinationName(s.getDestination() != null ? s.getDestination().getName() : null)
                .estimatedArrival(s.getEstimatedArrival())
                .currentLatitude(s.getCurrentLatitude())
                .currentLongitude(s.getCurrentLongitude())
                .assignedDriverId(s.getAssignedDriver() != null ? s.getAssignedDriver().getId() : null)
                .assignedDriverName(s.getAssignedDriver() != null ? s.getAssignedDriver().getFullName() : null)
                .customerName(s.getCustomerName())
                .customerContact(s.getCustomerContact())
                .receiverName(s.getReceiverName())
                .receiverContact(s.getReceiverContact())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .trackingHistory(history)
                .build();
    }

    public List<com.track2act.dto.response.LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream().map(l -> new com.track2act.dto.response.LocationDTO(l.getId(), l.getName(), com.track2act.dto.response.LocationDTO.LocationType.valueOf(l.getType().name()), l.getLatitude(), l.getLongitude())).collect(Collectors.toList());
    }
}
