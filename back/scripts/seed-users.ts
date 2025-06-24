import bcrypt from 'bcrypt';
import UserModel from '../src/models/UserModel';
import EventsModel from '../src/models/EventsModel';
import SignatureModel from '../src/models/SignatureModal';
import sequelize from '../src/config/database';

async function seed() {
  await sequelize.sync();

  // Usuários
  const users = [
    {
      name: 'Usuário Teste',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      cpf: '12345678901',
      type: 'usuario',
      assinatura_status: null,
    },
    {
      name: 'Organizador Teste',
      email: 'organizer@example.com',
      password: await bcrypt.hash('password123', 10),
      cpf: '98765432100',
      type: 'organizador',
      assinatura_status: null,
    },
  ];

  const createdUsers: UserModel[] = [];
  for (const user of users) {
    let dbUser = await UserModel.findOne({ where: { email: user.email } });
    if (!dbUser) {
      dbUser = await UserModel.create(user);
    }
    createdUsers.push(dbUser as UserModel);
  }

  // Eventos
  const organizer = createdUsers.find((u) => u.type === 'organizador');
  if (organizer) {
    const events = [
      {
        name: 'Evento de Teste 1',
        date: new Date(Date.now() + 86400000), // amanhã
        location: 'Auditório Central',
        description: 'Primeiro evento de teste automatizado.',
        image_url: null,
        organizer_id: organizer.id,
      },
      {
        name: 'Evento de Teste 2',
        date: new Date(Date.now() + 172800000), // depois de amanhã
        location: 'Sala 101',
        description: 'Segundo evento de teste automatizado.',
        image_url: null,
        organizer_id: organizer.id,
      },
    ];
    for (const event of events) {
      const exists = await EventsModel.findOne({ where: { name: event.name } });
      if (!exists) {
        await EventsModel.create(event);
      }
    }
  }

  // Assinaturas
  const user = createdUsers.find((u) => u.type === 'usuario');
  if (user) {
    const assinatura = await SignatureModel.findOne({
      where: { user_id: user.id },
    });
    if (!assinatura) {
      await SignatureModel.create({
        user_id: user.id,
        plan: 'mensal',
        status: 'ativa',
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      });
    }
  }

  console.log('Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao rodar o seed:', err);
  process.exit(1);
});
