import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin);

  // Create a second test user
  const testUserPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: testUserPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('✅ Test user created:', testUser);

  // Create a workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Sample Workspace',
      description: 'A sample workspace for team collaboration',
      ownerId: admin.id,
      members: {
        create: [
          {
            userId: admin.id,
            role: 'ADMIN',
          },
          {
            userId: testUser.id,
            role: 'MEMBER',
          },
        ],
      },
    },
  });

  console.log('✅ Sample workspace created:', workspace);

  // Create a sample project in workspace
  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      description: 'A sample project for demonstration',
      status: 'ACTIVE',
      userId: admin.id,
      workspaceId: workspace.id,
    },
  });

  console.log('✅ Sample project created:', project);

  // Create sample tasks with assignees
  const task1 = await prisma.task.create({
    data: {
      title: 'Setup Database',
      description: 'Configure and setup the database',
      status: 'DONE',
      priority: 'HIGH',
      userId: admin.id,
      projectId: project.id,
      assigneeId: admin.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement Authentication',
      description: 'Setup JWT authentication with refresh tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: admin.id,
      projectId: project.id,
      assigneeId: testUser.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Create API Documentation',
      description: 'Generate Swagger/OpenAPI documentation',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: admin.id,
      projectId: project.id,
    },
  });

  console.log('✅ Sample tasks created:', [task1, task2, task3]);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });