import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// Buscar todos os usuários (paginado)
export const getAll = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const users = await UserModel.findAndCountAll({
      limit: Number(limit),
      offset,
    });

    res.json({
      total: users.count,
      totalPages: Math.ceil(users.count / Number(limit)),
      data: users.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Buscar usuário por ID
export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Criar usuário (cadastro)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, cpf } = req.body;

    if (!name || !email || !password || !cpf) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verificar se o e-mail já está cadastrado
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      cpf,
      type: 'usuario',
      assinatura_status: null,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Atualizar usuário
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ error: 'Todos os campos são obrigatórios' });
    }

    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar nome
    user.name = name;

    // Atualizar senha criptografada
    user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar usuário
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = await UserModel.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login de usuário e geração de token JWT
export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('🔐 Tentativa de login recebida');
    console.log('📥 Dados recebidos:', req.body);

    const { email, password } = req.body;

    console.log('📥 Login request:', req.body);

    if (!email || !password) {
      console.log('❌ Email ou senha não fornecidos');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('🔍 Procurando usuário com email:', email);
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🔍 Verificando senha...');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('❌ Senha inválida');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login bem-sucedido para usuário:', user.id);
    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({ token, id: user.id });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Atualizar status de assinatura (tornar usuário organizador)
export const updateSubscription = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.type = 'organizador';
    user.assinatura_status = 'ativa';
    await user.save();

    res.json({ message: 'User upgraded to organizer', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Editar perfil (nome e email)
export const editProfile = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      return res
        .status(400)
        .json({ error: 'Informe nome ou email para atualizar.' });
    }
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    if (name) user.name = name;
    if (email) {
      // Verifica se o novo email já está em uso
      const existingUser = await UserModel.findOne({
        where: { email, id: { [Op.ne]: user.id } },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: 'Email já está em uso por outro usuário.' });
      }
      user.email = email;
    }
    await user.save();
    res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Trocar senha
export const changePassword = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Senha atual e nova senha são obrigatórias.' });
    }

    // Validação da nova senha
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          'A nova senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.',
      });
    }

    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
