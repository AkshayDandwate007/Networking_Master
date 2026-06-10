package com.example.backend.controller;

import com.example.backend.entity.AppUser;
import com.example.backend.entity.RoadmapPhase;
import com.example.backend.entity.Task;
import com.example.backend.repository.AppUserRepository;
import com.example.backend.repository.RoadmapPhaseRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    private final TaskRepository taskRepository;
    private final RoadmapPhaseRepository roadmapPhaseRepository;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    @Value("${app.login-alert.to:dandwateakshay45@gmail.com}")
    private String loginAlertTo;

    @Value("${app.login-alert.enabled:true}")
    private boolean loginAlertEnabled;

    public ApiController(TaskRepository taskRepository,
                         RoadmapPhaseRepository roadmapPhaseRepository,
                         AppUserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         JwtUtil jwtUtil,
                         JavaMailSender mailSender) {
        this.taskRepository = taskRepository;
        this.roadmapPhaseRepository = roadmapPhaseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
    }

    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setText(updatedTask.getText());
                    task.setCompleted(updatedTask.getCompleted());
                    task.setAssignedTo(updatedTask.getAssignedTo());
                    task.setCreatedBy(updatedTask.getCreatedBy());
                    task.setCreatedAt(updatedTask.getCreatedAt());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/phases")
    public List<RoadmapPhase> getPhases() {
        return roadmapPhaseRepository.findAll();
    }

    @PostMapping("/phases")
    public RoadmapPhase createPhase(@RequestBody RoadmapPhase phase) {
        return roadmapPhaseRepository.save(phase);
    }

    @PutMapping("/phases/{id}")
    public ResponseEntity<RoadmapPhase> updatePhase(@PathVariable Long id, @RequestBody RoadmapPhase updatedPhase) {
        return roadmapPhaseRepository.findById(id)
                .map(phase -> {
                    phase.setTitle(updatedPhase.getTitle());
                    phase.setTimeRange(updatedPhase.getTimeRange());
                    phase.setSalary(updatedPhase.getSalary());
                    phase.setTopics(updatedPhase.getTopics());
                    phase.setColor(updatedPhase.getColor());
                    phase.setStatus(updatedPhase.getStatus());
                    return ResponseEntity.ok(roadmapPhaseRepository.save(phase));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/phases/{id}")
    public ResponseEntity<Void> deletePhase(@PathVariable Long id) {
        if (!roadmapPhaseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roadmapPhaseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public List<AppUser> getUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public AppUser createUser(@RequestBody AppUser user) {
        user.setEmail(user.getEmail().trim().toLowerCase());
        if (user.getLoginId() == null || user.getLoginId().isBlank()) {
            user.setLoginId(generateLoginId(user.getName()));
        } else {
            user.setLoginId(user.getLoginId().trim().toUpperCase());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String loginId = payload.get("loginId");
        String password = payload.get("password");
        String identifier = loginId != null && !loginId.isBlank() ? loginId : email;

        if (identifier == null || password == null || identifier.isBlank() || password.isBlank()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Login ID/email and password are required");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        Optional<AppUser> userLookup = identifier.contains("@")
                ? userRepository.findByEmail(identifier.trim().toLowerCase())
                : userRepository.findByLoginId(identifier.trim().toUpperCase());

        return userLookup
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    sendLoginAlert(user);
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());
                    response.put("email", user.getEmail());
                    response.put("loginId", user.getLoginId());
                    response.put("name", user.getName());
                    response.put("role", user.getRole());
                    response.put("token", jwtUtil.generateToken(user));
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid credentials");
                    return ResponseEntity.status(401).body(errorResponse);
                });
    }

    private String generateLoginId(String name) {
        String prefix = "NR";
        if (name != null && !name.isBlank()) {
            String compact = name.replaceAll("[^A-Za-z]", "").toUpperCase();
            if (compact.length() >= 2) {
                prefix = compact.substring(0, 2);
            }
        }

        Random random = new Random();
        String loginId;
        do {
            loginId = prefix + (1000 + random.nextInt(9000));
        } while (userRepository.existsByLoginId(loginId));
        return loginId;
    }

    private void sendLoginAlert(AppUser user) {
        if (!loginAlertEnabled || loginAlertTo == null || loginAlertTo.isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(loginAlertTo);
            message.setSubject("Networking Roadmap Login Alert");
            message.setText("User logged in\n\nName: " + user.getName()
                    + "\nLogin ID: " + user.getLoginId()
                    + "\nEmail: " + user.getEmail());
            mailSender.send(message);
        } catch (Exception ex) {
            System.err.println("Login alert email failed: " + ex.getMessage());
        }
    }
}
