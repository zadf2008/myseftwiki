class NucleusParticle {
    constructor(type) {
        this.type = type; // 'proton' hoặc 'neutron'
        this.radius = 8;  // Kích thước mỗi hạt nhỏ trong nhân
        
        // Vị trí lệch (offset) ngẫu nhiên so với tâm nguyên tử để tạo thành một chùm hạt
        // Dùng Math.random() để rải các hạt xung quanh tâm trong phạm vi bán kính 15px
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 15; 
        this.offsetX = Math.cos(angle) * distance;
        this.offsetY = Math.sin(angle) * distance;

        // Đặt màu sắc riêng cho từng loại hạt
        if (this.type === 'proton') {
            this.color = '#ff4757'; // Proton màu đỏ rực
            this.glow = 10;
        } else {
            this.color = '#54a0ff'; // Neutron màu xanh dương dịu (hoặc xám trắng)
            this.glow = 5;
        }

        // Biến dùng để tạo hiệu ứng rung động năng lượng (lắc lư)
        this.shakeSpeed = 0.1 + Math.random() * 0.1;
        this.shakeAngle = Math.random() * 10;
    }

    // Hàm làm hạt nhân lắc lư nhẹ cho sinh động (không đứng chết một chỗ)
    update() {
        this.shakeAngle += this.shakeSpeed;
    }

    // Vẽ hạt nhỏ này lên màn hình
    draw() {
        ctx.save();
        // Dời về tâm màn hình
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Cộng thêm một chút hiệu ứng rung bằng toán học Sin/Cos
        const currentX = this.offsetX + Math.cos(this.shakeAngle) * 0.8;
        const currentY = this.offsetY + Math.sin(this.shakeAngle) * 0.8;

        ctx.beginPath();
        ctx.arc(currentX, currentY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.glow;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

// ===================================================
// KHUÔN 2: ĐÚC ELECTRON (Như tầng trước đã học)
// ===================================================
class Electron {
    constructor(radiusX, radiusY, rotationOval, speed, color) {
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.rotationOval = rotationOval;
        this.speed = speed;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.angle += this.speed;
    }

    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.rotationOval);

        // Vẽ quỹ đạo mờ
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Vẽ hạt electron
        const x = this.radiusX * Math.cos(this.angle);
        const y = this.radiusY * Math.sin(this.angle);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();

        ctx.restore();
    }
}

// ===================================================
// HỆ THỐNG QUẢN LÝ VÀ KHỞI TẠO NGUYÊN TỬ
// ===================================================
let nucleusList = []; // Mảng chứa các hạt Proton và Neutron
let electronList = []; // Mảng chứa các hạt Electron
let currentAtomInfo = ""; // Tên hiển thị

function createAtom(protonCount, neutronCount, electronCount, name) {
    nucleusList = [];
    electronList = [];
    currentAtomInfo = name;

    // ===================================================
    // 1. PROTON
    // ===================================================
    for (let i = 0; i < protonCount; i++) {
        nucleusList.push(new NucleusParticle('proton'));
    }

    // ===================================================
    // 2. NEUTRON
    // ===================================================
    for (let i = 0; i < neutronCount; i++) {
        nucleusList.push(new NucleusParticle('neutron'));
    }

    // ===================================================
    // 3. PHÂN ELECTRON VÀO CÁC LỚP
    // ===================================================

    let remaining = electronCount;

    // Lớp 1: tối đa 2
    // Lớp 2: tối đa 8
    // Lớp 3: tối đa 18
    // Lớp 4: tối đa 32
    const shellMax = [2, 8, 18, 32];

    for (let shell = 0; shell < shellMax.length; shell++) {

        if (remaining <= 0) {
            break;
        }

        // Số electron của lớp hiện tại
        const count = Math.min(
            remaining,
            shellMax[shell]
        );

        // Bán kính vòng
        const orbitRadius = 55 + shell * 35;

        // ===================================================
        // TẠO CÁC ELECTRON CÙNG NẰM TRÊN MỘT VÒNG
        // ===================================================

        for (let i = 0; i < count; i++) {

            // Chia đều electron quanh vòng
            const angle =
                (Math.PI * 2 / count) * i;

            const electron = new Electron(
                orbitRadius,
                orbitRadius,
                0,              // Tất cả cùng mặt phẳng
                0.04,
                '#ddff00'
            );

            // Class Electron của bạn vốn đặt angle ngẫu nhiên.
            // Ta ghi đè lại góc ban đầu.
            electron.angle = angle;

            electronList.push(electron);
        }

        remaining -= count;
    }
}