import { PrismaClient } from "@prisma/client";
import { faker, fakerFR } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- 1️⃣ Organizations ---
  const organizations = [];
  for (let i = 0; i < 3; i++) {
    const org = await prisma.organization.create({
      data: {
        name: faker.company.name(),
      },
    });
    organizations.push(org);
  }

  // --- 2️⃣ Admins ---
  const admins = [];
  for (let i = 0; i < 2; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: true,
        role: "ADMIN",
        image: faker.image.avatar(),
      },
    });
    admins.push(user);
  }

  // --- 3️⃣ Clinics ---
  const clinics = [];
  for (let i = 0; i < 5; i++) {
    const clinicUser = await prisma.user.create({
      data: {
        name: faker.company.name() + " Clinic",
        email: faker.internet.email(),
        emailVerified: true,
        role: "CLINIC",
        image: faker.image.urlLoremFlickr({ category: "hospitals" }),
      },
    });

    const clinic = await prisma.clinic.create({
      data: {
        userId: clinicUser.id,
        name: clinicUser.name!,
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        organizationId:
          organizations[faker.number.int({ max: organizations.length - 1 })].id,
      },
    });

    clinics.push(clinic);
  }

  // --- 4️⃣ Doctors ---
  const doctors = [];
  const specialties = [
    "Cardiology",
    "Pediatrics",
    "Dermatology",
    "Neurology",
    "General Medicine",
  ];

  for (let i = 0; i < 10; i++) {
    const doctorUser = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: true,
        role: "DOCTOR",
        image: faker.image.avatar(),
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: doctorUser.id,
        specialty: faker.helpers.arrayElement(specialties),
        clinicId:
          clinics[faker.number.int({ max: organizations.length - 1 })].id,
      },
    });
    doctors.push(doctor);
  }

  // --- 5️⃣ Patients ---
  const patients = [];
  for (let i = 0; i < 20; i++) {
    const patientUser = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        role: "PATIENT",
        image: faker.image.avatar(),
      },
    });

    const patient = await prisma.patient.create({
      data: {
        userId: patientUser.id,
        dateOfBirth: faker.date.birthdate({
          min: 1950,
          max: 2015,
          mode: "year",
        }),
        address: faker.location.streetAddress(),
      },
    });

    patients.push(patient);
  }

  // --- 6️⃣ Nurses ---
  const nurses = [];
  for (let i = 0; i < 5; i++) {
    const nurseUser = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: true,
        role: "NURSE",
        image: faker.image.avatar(),
      },
    });

    const nurse = await prisma.nurse.create({
      data: {
        userId: nurseUser.id,
        bio: fakerFR.lorem.lines(3),
        title: faker.helpers.arrayElement(specialties),
        clinicId: clinics[faker.number.int({ max: clinics.length - 1 })].id,
      },
    });
    nurses.push(nurse);
  }

  // --- 7️⃣ Lab Technicians ---
  const labTechs = [];
  for (let i = 0; i < 5; i++) {
    const labTechUser = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: true,
        role: "LAB_TECH",
        image: faker.image.avatar(),
      },
    });

    const labTech = await prisma.labTech.create({
      data: {
        userId: labTechUser.id,
        qualifications: faker.helpers.arrayElement(specialties),
        labName: faker.lorem.word(),
        clinicId: clinics[faker.number.int({ max: clinics.length - 1 })].id,
      },
    });
    labTechs.push(labTech);
  }

  console.log(`
✅ Seed completed! The following entries was created successfully
${organizations.length} organizations
${admins.length} admins
${clinics.length} clinics
${doctors.length} doctors
${patients.length} patients
${nurses.length} nurses
${labTechs.length} lab techs
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
