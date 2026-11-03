USE barbearia_agenda;

INSERT INTO users (nome, email, senha_hash, cpf, nivel)
VALUES
('Administrador Barbearia', 'admin@barbearia.local', '$2a$10$im4b38.YhaWffc4cY0BBy.sMjguXGc05mAfn8IkigJjrg/W39.kT2no', '52998224725', 'ADMIN')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO servicos (nome, descricao, preco, duracao_minutos, ativo) VALUES
('Corte Clássico', 'Corte tradicional com acabamento na tesoura e máquina.', 45.00, 40, 1),
('Corte + Barba', 'Corte completo com barba e acabamento.', 70.00, 60, 1),
('Barba Premium', 'Modelagem de barba com toalha quente.', 35.00, 30, 1),
('Corte Degradê', 'Degradê com acabamento detalhado.', 55.00, 45, 1),
('Platinado', 'Descoloração e tonalização. Necessita avaliação.', 120.00, 120, 1)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO barbeiros (nome, bio, ativo) VALUES
('Rafael', 'Especialista em degradê e cortes clássicos.', 1),
('Lucas', 'Focado em barba e visagismo masculino.', 1),
('Bruno', 'Cortes modernos e acabamento detalhado.', 1)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO horarios (data_horario, hora, barbeiro_id, status)
SELECT DATE_ADD(CURDATE(), INTERVAL d.dia DAY), h.hora, ((h.ordem - 1) MOD 3) + 1, 'DISPONIVEL'
FROM (
    SELECT 1 ordem, '09:00:00' hora UNION ALL
    SELECT 2, '10:00:00' UNION ALL
    SELECT 3, '11:00:00' UNION ALL
    SELECT 4, '13:00:00' UNION ALL
    SELECT 5, '14:00:00' UNION ALL
    SELECT 6, '15:00:00' UNION ALL
    SELECT 7, '16:00:00' UNION ALL
    SELECT 8, '17:00:00'
) h
CROSS JOIN (
    SELECT 1 dia UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
) d
LEFT JOIN horarios x ON x.data_horario = DATE_ADD(CURDATE(), INTERVAL d.dia DAY) AND x.hora = h.hora
WHERE x.id IS NULL;
