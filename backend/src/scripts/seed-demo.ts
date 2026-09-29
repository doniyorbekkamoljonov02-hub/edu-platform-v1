import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Parent } from '../parents/entities/parent.entity';
import { Admin } from '../admins/entities/admin.entity';
import { Director } from '../directors/entities/director.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Group } from '../groups/entities/group.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { DayOfWeek } from '../schedule/entities/day-of-week.enum';
import { Role } from '../common/enums/role.enum';

const PASSWORD = 'EduDemo2026!';
const ACCOUNTS = [
  { role: Role.ADMIN, email: 'admin@edu.local', firstName: 'Admin', lastName: 'Platform' },
  { role: Role.DIRECTOR, email: 'director@edu.local', firstName: 'Direktor', lastName: 'Platform' },
  { role: Role.TEACHER, email: 'teacher@edu.local', firstName: 'Gulchapchap', lastName: 'Gulomova' },
  { role: Role.STUDENT, email: 'student@edu.local', firstName: 'Azizbek', lastName: 'Karimov' },
  { role: Role.PARENT, email: 'parent@edu.local', firstName: 'Dilnoza', lastName: 'Karimova' },
];
async function run(){
 const app=await NestFactory.createApplicationContext(AppModule,{logger:['error','warn']}); const ds=app.get(DataSource);
 const users=ds.getRepository(User), students=ds.getRepository(Student), teachers=ds.getRepository(Teacher), parents=ds.getRepository(Parent), admins=ds.getRepository(Admin), directors=ds.getRepository(Director), subjects=ds.getRepository(Subject), groups=ds.getRepository(Group), schedules=ds.getRepository(Schedule);
 let subject=await subjects.findOneBy({name:'Ona tili'}); if(!subject) subject=await subjects.save(subjects.create({name:'Ona tili',description:'Demo fan',isActive:true}));
 const groupNames=['5-A','6-A','7-A']; const demoGroups:Group[]=[]; for(const name of groupNames){let g=await groups.findOneBy({name}); if(!g)g=await groups.save(groups.create({name,description:'Demo sinf',isActive:true})); demoGroups.push(g)}
 const made=new Map<Role,User>(); const hash=await bcrypt.hash(PASSWORD,10);
 for (const a of ACCOUNTS) {
   let u = await users.findOneBy({ email: a.email });
   if (!u) {
     u = users.create({ ...a, passwordHash: hash, isActive: true });
   } else {
     // Keep demo credentials deterministic even when the user already exists.
     // This fixes 401s caused by an older password hash left in the database.
     u.firstName = a.firstName;
     u.lastName = a.lastName;
     u.role = a.role;
     u.passwordHash = hash;
     u.isActive = true;
   }
   u = await users.save(u);
   made.set(a.role, u);
 }
 const su=made.get(Role.STUDENT)!; let student=await students.findOneBy({userId:su.id}); if(!student)student=await students.save(students.create({userId:su.id,groupId:demoGroups[2].id,enrollmentDate:'2026-09-01'}));
 const extraStudents = [
   { email: 'student5a@edu.local', firstName: 'Javohir', lastName: 'Aminov', group: demoGroups[0] },
   { email: 'student6a@edu.local', firstName: 'Jasmina', lastName: 'Marupova', group: demoGroups[1] },
 ];
 for (const item of extraStudents) {
   let u = await users.findOneBy({ email: item.email });
   if (!u) u = await users.save(users.create({ email:item.email, firstName:item.firstName, lastName:item.lastName, role:Role.STUDENT, passwordHash:hash, isActive:true }));
   if (!await students.findOneBy({ userId:u.id })) await students.save(students.create({ userId:u.id, groupId:item.group.id, enrollmentDate:'2026-09-01' }));
 }
 const tu=made.get(Role.TEACHER)!; let teacher=await teachers.findOneBy({userId:tu.id}); if(!teacher)teacher=await teachers.save(teachers.create({userId:tu.id,subjectId:subject.id,firstName:tu.firstName,lastName:tu.lastName,phone:'+998901234567'}));
 const pu=made.get(Role.PARENT)!; if(!await parents.findOneBy({userId:pu.id}))await parents.save(parents.create({userId:pu.id,studentId:student.id}));
 const au=made.get(Role.ADMIN)!; if(!await admins.findOneBy({userId:au.id}))await admins.save(admins.create({userId:au.id}));
 const du=made.get(Role.DIRECTOR)!; if(!await directors.findOneBy({userId:du.id}))await directors.save(directors.create({userId:du.id}));
 const days=[DayOfWeek.MONDAY,DayOfWeek.TUESDAY,DayOfWeek.WEDNESDAY];
 for(let i=0;i<demoGroups.length;i++){const exists=await schedules.findOneBy({teacherId:teacher.id,groupId:demoGroups[i].id,dayOfWeek:days[i]});if(!exists)await schedules.save(schedules.create({teacherId:teacher.id,subjectId:subject.id,groupId:demoGroups[i].id,dayOfWeek:days[i],startTime:`0${8+i}:00`,endTime:`0${8+i}:45`,room:`${10+i}`,isActive:true}))}
 console.log('\nDemo hisoblar tayyor. Parol barcha rollar uchun: '+PASSWORD); for(const a of ACCOUNTS)console.log(`${a.role}: ${a.email}`); console.log('Teacher 5-A, 6-A va 7-A sinflariga schedule orqali biriktirildi.\n'); await app.close();
}
run().catch(e=>{console.error(e);process.exit(1)});
