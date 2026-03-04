package com.erp.controller;
import com.erp.dto.ApiResponse;
import com.erp.model.Employee;
import com.erp.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "*")
public class HrController {
    @Autowired private EmployeeRepository employeeRepo;

    @GetMapping("/employees")
    public ResponseEntity<?> getAll(@RequestParam(required = false) String search) {
        List<Employee> list = search != null && !search.isEmpty()
            ? employeeRepo.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search)
            : employeeRepo.findAll();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return employeeRepo.findById(id)
            .map(e -> ResponseEntity.ok(ApiResponse.ok(e)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/employees")
    public ResponseEntity<?> create(@RequestBody Employee emp) {
        Employee saved = employeeRepo.save(emp);
        return ResponseEntity.ok(ApiResponse.ok("Employee created", saved));
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Employee emp) {
        if (!employeeRepo.existsById(id)) return ResponseEntity.notFound().build();
        emp.setId(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee updated", employeeRepo.save(emp)));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        employeeRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee deleted", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        long total = employeeRepo.count();
        long active = employeeRepo.findByStatus(Employee.EmployeeStatus.ACTIVE).size();
        long onLeave = employeeRepo.findByStatus(Employee.EmployeeStatus.ON_LEAVE).size();
        List<String> departments = employeeRepo.findAllDepartments();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "totalEmployees", total,
            "activeEmployees", active,
            "onLeave", onLeave,
            "departments", departments.size()
        )));
    }
}
