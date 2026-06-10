INSERT INTO app_users (email, login_id, password, name, role) VALUES
('ak1001@gmail.com', 'AK1001', '$2a$10$kfkP3lQ1kYcL9j.n4U.6fef5Xv6m3w2NNZlWqern3tMDqKXE.Y2i6', 'Master Admin', 'master-admin'),
('aksai1001@gmail.com', 'AK1002', '$2a$10$kfkP3lQ1kYcL9j.n4U.6fef5Xv6m3w2NNZlWqern3tMDqKXE.Y2i6', 'Admin User', 'admin');

INSERT INTO roadmap_phases (title, time_range, salary, topics, color, status) VALUES
('PHASE 0: You Are Here', 'Right now', '₹2.5–4 LPA', 'Desktop support,Basic networking,Troubleshooting', 'purple', 'active'),
('PHASE 1: CCNA & Networking Fundamentals', 'Month 1–12', '₹7–12 LPA', 'OSI Model,Routing,Switching,VLANs,ACLs', 'blue', 'active'),
('PHASE 2: Server Management + AD + Linux', 'Month 6–18', '₹8–15 LPA', 'Windows Server,Active Directory,Linux Admin,Storage', 'green', 'planned'),
('PHASE 3: Network Automation + DevNet', 'Month 12–24', '₹12–20 LPA', 'Python,APIs,Ansible,Git,DevNet Cert', 'pink', 'planned');
