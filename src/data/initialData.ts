import {
  Cidade,
  PontoTuristico,
  PaulistaContent,
  MercadaoHeader,
  MercadaoProduto,
  LiberdadeContent,
  PratoCulinaria,
  ItemArtesanato,
  ItemCultura,
  EventoHistorico,
  CuriosidadeVoceSabia,
  PerguntaQuiz,
  MenuItem,
  Banner,
  SecaoSite,
  ConfigAparencia,
  ConfigIdentidade,
  ConfigModoFeira,
  AdminUser,
  LogAlteracao,
  MediaItem,
  Regiao,
  FotoMural
} from '../types/database';

export const INITIAL_REGIOES: Regiao[] = [
  { id: 'reg_1', nome: 'Capital & Região Metropolitana', descricao: 'O coração econômico e cultural do país', corHex: '#3B82F6' },
  { id: 'reg_2', nome: 'Litoral Paulista', descricao: 'Praias paradisíacas, biodiversidade e história caiçara', corHex: '#06B6D4' },
  { id: 'reg_3', nome: 'Vale do Paraíba & Serra da Mantiqueira', descricao: 'Montanhas, clima frio, religiosidade e alta tecnologia', corHex: '#10B981' },
  { id: 'reg_4', nome: 'Campinas & RMC', descricao: 'Polo científico, tecnológico e universitário de ponta', corHex: '#F59E0B' },
  { id: 'reg_5', nome: 'Ribeirão Preto & Nordeste', descricao: 'A capital do agronegócio e da cultura caipira rica', corHex: '#EF4444' },
  { id: 'reg_6', nome: 'Sorocaba & Sudoeste', descricao: 'História tropeira, parques e polo industrial em expansão', corHex: '#8B5CF6' },
  { id: 'reg_7', nome: 'Central (Bauru & Araraquara)', descricao: 'Centro geográfico do estado e grande força acadêmica', corHex: '#EC4899' },
];

export const INITIAL_CIDADES: Cidade[] = [
  {
    id: 'cid_1',
    titulo: 'São Paulo (Capital)',
    descricao: 'A maior metrópole da América Latina, centro financeiro, gastronômico e cultural global.',
    regiaoId: 'reg_1',
    regiaoNome: 'Capital & Região Metropolitana',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [
      '/images/paulista_avenue_1790701728460.jpg',
      '/images/mercadao_sp_1790701738265.jpg',
      '/images/liberdade_japantown_1790701747719.jpg'
    ],
    historia: 'Fundada em 25 de janeiro de 1554 pelos padres Manuel da Nóbrega e José de Anchieta ao redor do Colégio dos Jesuítas no Pátio do Terço. Transformou-se de pequena vila no topo do planalto de Piratininga na quinta maior aglomeração urbana do planeta.',
    cultura: 'Caldeirão multicultural de imigrantes italianos, japoneses, libaneses, espanhóis, alemães e migrantes nordestinos. Abriga mais de 110 museus, 160 teatros e a famosa Bienal de Artes.',
    gastronomia: 'Capital mundial da gastronomia, famosa pelas pizzarias tradicionais no Bixiga, pelo sanduíche de mortadela do Mercadão, pastel de feira e estrelados restaurantes internacionais.',
    turismo: 'Avenida Paulista, Parque Ibirapuera, Museu do Ipiranga, Pinacoteca do Estado, MASP, Bairro da Liberdade e Edifício Farol Santander.',
    curiosidades: [
      'São Paulo possui a maior comunidade de japoneses fora do Japão.',
      'Mais de 1 milhão de pizzas são consumidas diariamente na capital paulista.',
      'Possui a maior frota de helicópteros privados do mundo.'
    ],
    populacao: '11.45 milhões',
    distanciaCapital: '0 km',
    posicaoMapa: { x: 55, y: 72 },
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-10T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cid_2',
    titulo: 'Santos',
    descricao: 'A maior cidade do litoral paulista, berço do maior porto da América Latina e dos belos jardins da orla.',
    regiaoId: 'reg_2',
    regiaoNome: 'Litoral Paulista',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: ['/images/sp_hero_banner_1790701710531.jpg'],
    historia: 'Fundada em 1546 por Brás Cubas, Santos foi fundamental no ciclo do café. O Museu do Café no histórico palácio da Bolsa Oficial reflete a importância econômica da cidade.',
    cultura: 'Forte ligação com o surfe (berço do surfe brasileiro com Thomas Rittscher), futebol (Santos Futebol Clube de Pelé) e arquitetura histórica no Centro Histórico com bonde elétrico.',
    gastronomia: 'Meia-Açorda de Marisco, Meca Santista (o prato oficial da cidade com peixe grelhado, risoto de palmito e farofa de banana) e frutos do mar frescos.',
    turismo: 'Bonde Histórico, Aquário de Santos, Museu do Café, Monte Serrat, Orla de Santos (maior jardim praiano do mundo no Guinness Book).',
    curiosidades: [
      'O jardim da orla de Santos é registrado no Guinness World Records como o maior jardim frontal de praia do mundo com 5.335 metros de extensão.',
      'O Porto de Santos responde por mais de 25% do comércio exterior brasileiro.'
    ],
    populacao: '418.600 hab',
    distanciaCapital: '72 km',
    posicaoMapa: { x: 62, y: 78 },
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-12T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cid_3',
    titulo: 'Campos do Jordão',
    descricao: 'Conhecida como a "Suíça Brasileira", famosa pelo clima montanhoso, arquitetura enxaimel e Festival de Inverno.',
    regiaoId: 'reg_3',
    regiaoNome: 'Vale do Paraíba & Serra da Mantiqueira',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'Desenvolveu-se no topo da Serra da Mantiqueira a 1.628 metros de altitude, sendo inicialmente refúgio sanatorial pelo ar puro e cristalino, tornando-se o principal destino de inverno de São Paulo.',
    cultura: 'Tradição em música clássica com o maior festival internacional de música da América Latina, fábricas artesanais de chocolate e artes visuais no Palácio Boa Vista.',
    gastronomia: 'Fondue de queijo e chocolate, trutas frescas da Mantiqueira, cervejas artesanais e pinhão assado.',
    turismo: 'Vila Capivari, Morro do Elefante, Parque Amantikir, Teleférico, Auditório Cláudio Santoro e Horto Florestal.',
    curiosidades: [
      'É o município brasileiro com a sede administrativa mais elevada, a 1.628 metros de altitude.',
      'A temperatura da cidade já atingiu impressionantes -7.3°C no inverno de 1981.'
    ],
    populacao: '53.000 hab',
    distanciaCapital: '172 km',
    posicaoMapa: { x: 74, y: 55 },
    status: 'PUBLICADO',
    ordem: 3,
    dataCriacao: '2026-01-15T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cid_4',
    titulo: 'Campinas',
    descricao: 'Segunda maior metrópole paulista, referência nacional em tecnologia, saúde e ensino universitário.',
    regiaoId: 'reg_4',
    regiaoNome: 'Campinas & RMC',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'Surgiu no século XVIII como pouso de tropeiros no "Caminho dos Goiases". Destacou-se na era do café e se reinventou no século XX como o Vale do Silício do Brasil.',
    cultura: 'Sede da Unicamp, do Sincrotron Sirius (o mais avançado laboratório de luz sincrotron da América Latina) e de rica cena teatral e patrimonial.',
    gastronomia: 'Coxinha de massa de batata tradicional, sanduíche Moinho de Vento, pratos da culinária caipira e cervejarias locais.',
    turismo: 'Lagoa do Taquaral, Bosque dos Jequitibás, Maria Fumaça Campinas-Jaguariúna, Observatório de Capricórnio e Torre do Castelo.',
    curiosidades: [
      'Campinas é a única cidade não-capital do Brasil com população superior a 1 milhão de habitantes que possui aeroporto internacional (Viracopos).',
      'Abriga o acelerador de partículas Sirius, um dos equipamentos científicos mais complexos já construídos no país.'
    ],
    populacao: '1.13 milhão',
    distanciaCapital: '93 km',
    posicaoMapa: { x: 48, y: 62 },
    status: 'PUBLICADO',
    ordem: 4,
    dataCriacao: '2026-01-18T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cid_5',
    titulo: 'Ribeirão Preto',
    descricao: 'Conhecida como a "Capital do Agronegócio", referência no cultivo de cana-de-açúcar, chopp gelado e gastronomia.',
    regiaoId: 'reg_5',
    regiaoNome: 'Ribeirão Preto & Nordeste',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'Fundada em 1856 por fazendeiros, viveu a "fase de ouro do café" conhecida como a Califórnia Brasileira, atraindo milhares de imigrantes italianos.',
    cultura: 'Tradição do Theatro Pedro II (uma das melhores acústicas do país), choperia histórica Pinguim e grandes feiras do setor agrícola como Agrishow.',
    gastronomia: 'Chopp lendário tirado com maestria, picanha no recheio, costela de chão e pratos caipiras fartos.',
    turismo: 'Theatro Pedro II, Choperia Pinguim, Parque Curupira, Bosque Zoo Fábio Barreto e Palacete Franco de Lessa.',
    curiosidades: [
      'A choperia Pinguim na praça do teatro ficou conhecida nacionalmente pela lenda de que o chopp vinha diretamente da fábrica por uma tubulação subterrânea!',
      'É considerada a Capital Cultural do Interior de SP devido a seus museus e teatros opulentos herdados do ciclo do café.'
    ],
    populacao: '698.600 hab',
    distanciaCapital: '313 km',
    posicaoMapa: { x: 42, y: 38 },
    status: 'PUBLICADO',
    ordem: 5,
    dataCriacao: '2026-01-20T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cid_6',
    titulo: 'Aparecida',
    descricao: 'O maior centro de peregrinação religiosa da América Latina e sede do Santuário Nacional da Padroeira do Brasil.',
    regiaoId: 'reg_3',
    regiaoNome: 'Vale do Paraíba & Serra da Mantiqueira',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'História iniciada em outubro de 1717, quando os pescadores Domingos Martins, João Alves e Felipe Pedroso encontraram a imagem de Nossa Senhora da Conceição Aparecida nas águas do Rio Paraíba do Sul.',
    cultura: 'Profunda religiosidade popular, romarias de milhões de fiéis, artesanato sacral e a caminhada do Caminho da Fé.',
    gastronomia: 'Comida de feira religiosa, Filé à Parmegiana dos restaurantes locais, doce de abóbora com coco e paçoca de amendoim.',
    turismo: 'Santuário Nacional de Nossa Senhora Aparecida (segunda maior igreja católica do mundo), Passarela da Fé, Morro do Cruzeiro, Bontur Bondinhos Aéreos.',
    curiosidades: [
      'A Basílica de Aparecida recebe mais de 12 milhões de visitantes por ano.',
      'A Basílica Nova é a segunda maior catedral do mundo em área construída, ficando atrás apenas da Basílica de São Pedro no Vaticano!'
    ],
    populacao: '36.000 hab',
    distanciaCapital: '170 km',
    posicaoMapa: { x: 80, y: 60 },
    status: 'PUBLICADO',
    ordem: 6,
    dataCriacao: '2026-01-22T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_PONTOS_TURISTICOS: PontoTuristico[] = [
  {
    id: 'pt_1',
    titulo: 'MASP - Museu de Arte de São Paulo',
    descricao: 'Cartão-postal da capital, assinado por Lina Bo Bardi com seu épico vão livre de 74 metros.',
    cidadeId: 'cid_1',
    cidadeNome: 'São Paulo (Capital)',
    regiaoNome: 'Capital & Região Metropolitana',
    categoria: 'Arquitetura',
    imagemPrincipal: '/images/paulista_avenue_1790701728460.jpg',
    galeria: ['/images/paulista_avenue_1790701728460.jpg'],
    historia: 'Inaugurado em 1968 na Avenida Paulista, o MASP é famoso pelos cavaletes de vidro desenhados por Lina Bo Bardi que fazem os quadros "flutuarem" no espaço.',
    curiosidade: 'Seu acervo conta com mais de 11.000 obras, incluindo quadros de Van Gogh, Monet, Cézanne, Renoir, Picasso e Candido Portinari.',
    endereco: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
    siteExterno: 'https://masp.org.br',
    posicaoMapa: { x: 55, y: 72 },
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-10T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'pt_2',
    titulo: 'Mercado Municipal Paulistano (Mercadão)',
    descricao: 'Templo da gastronomia paulistana com vitrais alemães e iguarias típicas incomparáveis.',
    cidadeId: 'cid_1',
    cidadeNome: 'São Paulo (Capital)',
    regiaoNome: 'Capital & Região Metropolitana',
    categoria: 'Lazer',
    imagemPrincipal: '/images/mercadao_sp_1790701738265.jpg',
    galeria: ['/images/mercadao_sp_1790701738265.jpg'],
    historia: 'Projetado pelo escritório do arquiteto Ramos de Azevedo e inaugurado em 1933. Possui 72 vitrais de Conrado Sorgenicht Filho ilustrando a agropecuária paulista.',
    curiosidade: 'Consome mais de 10 toneladas de mortadela por semana nos seus famosos sanduíches fartos!',
    endereco: 'Rua Cantareira, 306 - Centro Histórico de São Paulo',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-11T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'pt_3',
    titulo: 'Parque Ibirapuera',
    descricao: 'O pulmão verde de São Paulo com marquise idealizada por Oscar Niemeyer e paisagismo de Burle Marx.',
    cidadeId: 'cid_1',
    cidadeNome: 'São Paulo (Capital)',
    regiaoNome: 'Capital & Região Metropolitana',
    categoria: 'Natureza',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'Inaugurado em 1954 nas comemorações do IV Centenário da cidade de São Paulo. Foi eleito o melhor parque urbano do mundo pelo jornal The Guardian.',
    curiosidade: 'O parque possui 158 hectares e abriga a OCA, o Museu de Arte Moderna (MAM), a Fundação Bienal e o Auditório Ibirapuera.',
    endereco: 'Av. Pedro Álvares Cabral - Vila Mariana, São Paulo',
    status: 'PUBLICADO',
    ordem: 3,
    dataCriacao: '2026-01-12T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'pt_4',
    titulo: 'Bairro da Liberdade & Feira Oriental',
    descricao: 'A maior colônia japonesa do mundo fora do Japão, com luminárias suzuran vermelhas e culinária asiática.',
    cidadeId: 'cid_1',
    cidadeNome: 'São Paulo (Capital)',
    regiaoNome: 'Capital & Região Metropolitana',
    categoria: 'Cultura',
    imagemPrincipal: '/images/liberdade_japantown_1790701747719.jpg',
    galeria: ['/images/liberdade_japantown_1790701747719.jpg'],
    historia: 'A partir de 1912, imigrantes japoneses vindos do navio Kasato Maru instalaram-se na Rua Conde de Sarzedas. O bairro evoluiu para abrigar também chineses e coreanos.',
    curiosidade: 'O portal vermelho Torii de 9 metros de altura na Rua Galvão Bueno marca a entrada simbólica do bairro oriental.',
    endereco: 'Praça da Liberdade - São Paulo, SP',
    status: 'PUBLICADO',
    ordem: 4,
    dataCriacao: '2026-01-13T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_PAULISTA: PaulistaContent = {
  id: 'paulista_1',
  titulo: 'Avenida Paulista: A Artéria Cultural de São Paulo',
  subtitulo: 'Símbolo do dinamismo, arquitetura, arte, manifestações e diversidade no coração da metrópole.',
  descricao: 'Com quase 3 quilômetros de extensão, a Avenida Paulista conecta o centro antigo à zona sul. De feudo dos barões do café a centro financeiro e tecnológico, tornou-se hoje o maior polo cultural aberto da América Latina.',
  imagemPrincipal: '/images/paulista_avenue_1790701728460.jpg',
  galeria: ['/images/paulista_avenue_1790701728460.jpg', '/images/sp_hero_banner_1790701710531.jpg'],
  status: 'PUBLICADO',
  ordem: 1,
  dataCriacao: '2026-01-01T10:00:00Z',
  dataAtualizacao: '2026-09-29T10:00:00Z',
  videoUrl: 'https://www.youtube.com/watch?v=sample',
  curiosidades: [
    'A Paulista foi inaugurada em 8 de dezembro de 1891 pelo engenheiro Joaquim Eugênio de Lima.',
    'Foi a primeira via pública asfaltada de São Paulo, em 1909, utilizando asfalto importado da Alemanha.',
    'Aos domingos e feriados, a avenida é fechada para veículos e transformada no projeto Paulista Aberta para pedestres e ciclistas.'
  ],
  pontosDeInteresse: [
    'MASP (Museu de Arte de São Paulo)',
    'Japan House São Paulo',
    'IMS (Instituto Moreira Salles)',
    'Sesc Paulista & Mirante',
    'Casa das Rosas (Espaço de Poesia e Literatura)',
    'Centro Cultural FIESP',
    'Parque Trianon (Reserva de Mata Atlântica nativa)'
  ],
  linhaDoTempo: [
    {
      id: 'p_milestone_1',
      ano: 1891,
      titulo: 'Inauguração da Avenida',
      descricao: 'Planejada pelo engenheiro Joaquim Eugênio de Lima com 28 metros de largura para abrigar mansões luxuosas dos barões do café.',
      imagem: '/images/paulista_avenue_1790701728460.jpg',
      ordem: 1
    },
    {
      id: 'p_milestone_2',
      ano: 1909,
      titulo: 'Primeira Via Asfaltada',
      descricao: 'A Paulista é a primeira avenida paulistana a receber pavimentação de asfalto, trazido da Alemanha.',
      ordem: 2
    },
    {
      id: 'p_milestone_3',
      ano: 1968,
      titulo: 'Inauguração do MASP',
      descricao: 'Rainha Elizabeth II do Reino Unido participa da inauguração da nova sede do MASP desenhada por Lina Bo Bardi.',
      imagem: '/images/paulista_avenue_1790701728460.jpg',
      ordem: 3
    },
    {
      id: 'p_milestone_4',
      ano: 1991,
      titulo: 'Chegada do Metrô Linha 2-Verde',
      descricao: 'Abertura das estações de metrô que revolucionaram a mobilidade ao longo do espigão central.',
      ordem: 4
    },
    {
      id: 'p_milestone_5',
      ano: 2016,
      titulo: 'Paulista Aberta para Pedestres',
      descricao: 'A avenida passa a ser oficialmente fechada aos carros aos domingos para se tornar um enorme parque linear de cultura e esporte.',
      imagem: '/images/paulista_avenue_1790701728460.jpg',
      ordem: 5
    }
  ]
};

export const INITIAL_MERCADAO_HEADER: MercadaoHeader = {
  id: 'mer_header_1',
  titulo: 'Mercado Municipal Paulistano: O Templo da Gastronomia Paulista',
  subtitulo: 'Inaugurado em 1933 com projeto de Ramos de Azevedo e 72 vitrais alemães de Conrado Sorgenicht.',
  descricao: 'O Mercado Municipal de São Paulo é o mais famoso entreposto gastronômico do país.',
  imagemPrincipal: '/images/mercadao_sp_1790701738265.jpg',
  historia: 'Inaugurado em 1933 com projeto assinado pelo renomado escritório de Ramos de Azevedo, o Mercadão é um dos cartões-postais gastronômicos mais famosos do país. Abriga 72 vitrais alemães do artista Conrado Sorgenicht Filho ilustrando a agropecuária paulista e oferece iguarias, frutas raras e a famosa gastronomia do centro histórico.',
  iguarias: [
    '🥪 Sanduíche de Mortadela Fartíssimo (400g)',
    '🥟 Pastel de Bacalhau do Hocca (Desde 1952)',
    '🥭 Frutas Exóticas & Tropicais Raras',
    '🧀 Queijos Finos & Embutidos Artesanais',
    '🏛️ 72 Vitrais Alemães Ilustrando SP'
  ],
  status: 'PUBLICADO',
  ordem: 1,
  dataCriacao: '2026-01-01T00:00:00Z',
  dataAtualizacao: '2026-09-29T10:00:00Z'
};

export const INITIAL_MERCADAO: MercadaoProduto[] = [
  {
    id: 'mer_1',
    titulo: 'Sanduíche de Mortadela Fartíssimo',
    descricao: 'O lendário sanduíche com quase meio quilo de mortadela derretida com queijo provolone no pão francês crocante.',
    categoria: 'Lanches',
    imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
    curiosidade: 'Surgiu por brincadeira na década de 1930 quando um cliente reclamou do recheio fino e o dono do box decidiu caprichar na quantidade!',
    origem: 'Bar do Mané no Mercadão de SP',
    utilizacao: 'Consumido quente no mezanino histórico do mercado acompanhado de cerveja bem gelada.',
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-10T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'mer_2',
    titulo: 'Pastel de Bacalhau do Hocca',
    descricao: 'Pastel dourado e sequinho recheado com mais de 200g do mais nobre bacalhau do Atlântico e azeite extra virgem.',
    categoria: 'Produtos regionais',
    imagem: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
    curiosidade: 'Criado pela família imigrante portuguesa Horácio em 1952, tornou-se patrimônio imaterial da cidade.',
    origem: 'Hocca Bar no Mercadão',
    utilizacao: 'Acompanhado de pimenta caseira verde.',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-11T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'mer_3',
    titulo: 'Frutas Exóticas & Tropicais',
    descricao: 'Pitaia, Pitaia Amarela da Colômbia, Mangostão, Achachairú, Tamarillo e Granadilla servidos em degustações animadas pelos feirantes.',
    categoria: 'Frutas',
    imagem: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800&auto=format&fit=crop',
    curiosidade: 'Os feirantes do Mercadão são conhecidos pelas cortejadoras degustações de frutas docíssimas diretamente na faca.',
    origem: 'Bancas de Frutas do Mercadão',
    utilizacao: 'Consumo in natura ou elaboração de sobremesas finas.',
    status: 'PUBLICADO',
    ordem: 3,
    dataCriacao: '2026-01-12T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_LIBERDADE: LiberdadeContent = {
  id: 'lib_1',
  titulo: 'Bairro da Liberdade: Tradição e Modernidade Oriental',
  subtitulo: 'Polo de vivência japonesa, chinesa e coreana no centro de São Paulo.',
  descricao: 'Com suas luminárias vermelhas de estilo Suzuran e portais Torii, a Liberdade é um portal de imersão na arquitetura, gastronomia, festivais e cultura pop asiática no Brasil.',
  imagemPrincipal: '/images/liberdade_japantown_1790701747719.jpg',
  galeria: ['/images/liberdade_japantown_1790701747719.jpg'],
  historia: 'Inicialmente chamado de Campo da Forca no século XIX, mudou de nome em 1858 para Liberdade. Em 1908 aportou no Brasil o Kasato Maru, trazendo os primeiros imigrantes orientais que fixaram residência nas hospedarias do bairro.',
  cultura: 'Celebração de datas tradicionais como Tanabata Matsuri (Festival das Estrelas), Ano Novo Chinês e Feira de Artesanato da Praça da Liberdade.',
  gastronomia: 'Lamen fumegante, sushi artesanal, guioza crocante, takoyaki, dorayaki, doces de feijão azuki e chás tradicionais.',
  arquitetura: 'Postes com luminárias suzuran orientais, grandes arcos torii vermelhos, fachadas com kanjis e jardins de carpas.',
  festivais: 'Tanabata Matsuri (Julho), Hana Matsuri (Festival das Flores em Abril) e Toyo Matsuri (Dezembro).',
  curiosidades: [
    'A Feira da Liberdade ocorre aos sábados e domingos desde 1975 na Praça da Liberdade.',
    'A maior concentração de descendentes de japoneses fora do Japão reside no Estado de São Paulo (cerca de 1.9 milhão de pessoas).'
  ],
  status: 'PUBLICADO',
  ordem: 1,
  dataCriacao: '2026-01-01T10:00:00Z',
  dataAtualizacao: '2026-09-29T10:00:00Z'
};

export const INITIAL_CULINARIA: PratoCulinaria[] = [
  {
    id: 'cul_1',
    titulo: 'Virado à Paulista',
    descricao: 'Prato histórico substancioso feito com tutu de feijão temperado, arroz, couve refogada, bisteca de porco, ovo frito e banana frita.',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'Patrimônio Imaterial de SP. Surgiu no século XVI com as expedições dos Bandeirantes, que levavam feijão cozido com farinha de milho dentro de alforjes de couro. O balanço das viagens "virava" a mistura.',
    ingredientes: ['Feijão carioquinha cozido', 'Farinha de milho ou mandioca', 'Bisteca suína', 'Couve fresca em tiras', 'Ovo frito com gema mole', 'Banana empanada', 'Torresmo crocante'],
    modoApresentacao: 'Servido tradicionalmente às segundas-feiras nos restaurantes paulistas como símbolo de fartura e energia para iniciar a semana.',
    origemCultural: 'Troperismo e Sertões de São Paulo (Culinária Caipira)',
    cidadeOuRegiao: 'Todo o Estado de São Paulo',
    curiosidade: 'Em 2018, o Virado à Paulista foi reconhecido como Patrimônio Imaterial do Estado de São Paulo pelo Condephaat.',
    categoria: 'Comida tradicional',
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-05T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cul_2',
    titulo: 'Pastel de Feira com Caldo de Cana',
    descricao: 'O clássico lanche matinal das feiras livres paulistanas: massa estaladiça e recheada servida com caldo de cana geladinho com limão.',
    imagemPrincipal: '/images/mercadao_sp_1790701738265.jpg',
    galeria: [],
    historia: 'Introduzido pelos imigrantes chineses e japoneses na década de 1940 durante a Segunda Guerra Mundial, adaptando o rolinho primavera chinês para a massa frita rápida.',
    ingredientes: ['Massa de trigo com cachaça caseira', 'Carne moída temperada, queijo ou frango com catupiry', 'Cana de açúcar moída na hora', 'Gotas de limão taiti ou galego'],
    modoApresentacao: 'Em guardanapo de papel nas barracas de feira ao ar livre.',
    origemCultural: 'Imigração Asiática e Feiras Libres Paulistanas',
    cidadeOuRegiao: 'São Paulo, Campinas e Santos',
    curiosidade: 'A adição de um pingo de cachaça na massa é o segredo para a formação das famosas "bolhas" crocantes ao fritar!',
    categoria: 'Comida de rua',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-06T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cul_3',
    titulo: 'Tainha Recheada na Folha de Bananeira',
    descricao: 'Peixe fresco assado na brasa recheado com farofa de camarão e ervas marinhas caiçaras.',
    imagemPrincipal: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    historia: 'Herança direta dos povos indígenas Tupinambás no Litoral Paulista, combinada com temperos portugueses durante as vilas de pescadores.',
    ingredientes: ['Tainha fresca inteira', 'Farofa de camarão com farinha de mandioca d\'água', 'Folhas de bananeira tostadas', 'Coentro e limão cravo'],
    modoApresentacao: 'Servida em prancha de madeira com pirão de peixe fumegante.',
    origemCultural: 'Culinária Caiçara do Litoral Norte e Sul',
    cidadeOuRegiao: 'Santos, Ubatuba, São Sebastião e Cananéia',
    curiosidade: 'A Festa da Tainha em Bertioga e Ilhabela atrai milhares de turistas no meio do ano durante a safra do peixe.',
    categoria: 'Culinária caiçara',
    status: 'PUBLICADO',
    ordem: 3,
    dataCriacao: '2026-01-07T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_ARTESANATO: ItemArtesanato[] = [
  {
    id: 'art_1',
    titulo: 'Esculturas e Entalhes em Madeira de Embu das Artes',
    descricao: 'Peças entalhadas à mão em madeira de demolição representando figuras históricas, sacras e animais da fauna paulista.',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    cidade: 'Embu das Artes',
    regiao: 'Capital & Região Metropolitana',
    material: 'Madeira nobre reciclável, jequitibá e cedro',
    historia: 'Na década de 1960, a Feira de Artes e Artesanato de Embu atraiu pintores, escultores e poetas, consolidando a cidade como estância turística da arte popular.',
    curiosidade: 'A Feira de Embu das Artes reúne mais de 500 expositores aos finais de semana há mais de 50 anos.',
    categoria: 'Madeira',
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-08T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'art_2',
    titulo: 'Cerâmica Figurativa de Taubaté (Figureiras)',
    descricao: 'Pequenas esculturas de barro cozido pintadas com cores vibrantes representando o "Pequeno Pavão", figuras da roça e presépios.',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    cidade: 'Taubaté',
    regiao: 'Vale do Paraíba',
    material: 'Argila natural e tinta acrílica colorida',
    historia: 'As Figureiras de Taubaté mantêm viva a tradição iniciada no século XIX no Bairro do Imaculada com a mística do pavão de barro de asas abertas.',
    curiosidade: 'O Pavão de Barro de Taubaté tornou-se símbolo do artesanato do Estado de São Paulo.',
    categoria: 'Cerâmica',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-09T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_CULTURA: ItemCultura[] = [
  {
    id: 'cul_art_1',
    titulo: 'A Tradição do Choro e do Samba Paulista',
    descricao: 'O samba feito em São Paulo possui cadence única, eternizado por Adoniran Barbosa e Paulo Vanzolini no Bixiga e no Brequinho.',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    cidadeOuRegiao: 'São Paulo (Bixiga e Barra Funda)',
    categoria: 'música',
    destaque: 'Samba de Brequinho & Adoniran Barbosa',
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-10T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cul_art_2',
    titulo: 'Orquestra de Violas e a Cultura Caipira',
    descricao: 'A sonoridade mágica da viola caipira de 10 cordas ecoando modas de viola, catira e mitos do folclore interiorano.',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    galeria: [],
    cidadeOuRegiao: 'Piracicaba, Botucatu e Ribeirão Preto',
    categoria: 'cultura caipira',
    destaque: 'Modas de Viola de Tião Carreiro & Pardinho',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-11T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_HISTORIA: EventoHistorico[] = [
  {
    id: 'hist_1',
    titulo: 'Fundação de São Paulo no Pátio do Colégio',
    descricao: 'Padres jesuítas celebram a primeira missa no planalto de Piratininga em 25 de janeiro de 1554.',
    periodo: 'Século XVI',
    dataOuAno: '1554',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    curiosidade: 'A data de 25 de janeiro celebra a conversão do apóstolo Paulo no calendário católico.',
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-01T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'hist_2',
    titulo: 'Independência do Brasil às Margens do Ipiranga',
    descricao: 'D. Pedro I proclama "Independência ou Morte!" às margens do Riacho do Ipiranga em São Paulo.',
    periodo: 'Século XIX',
    dataOuAno: '1822',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    curiosidade: 'O local hoje abriga o majestoso Museu do Ipiranga e o Parque da Independência.',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-02T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'hist_3',
    titulo: 'Semana de Arte Moderna de 1922',
    descricao: 'Artistas no Theatro Municipal como Mário de Andrade, Oswald de Andrade e Tarsila do Amaral revolucionam a cultura brasileira com o Modernismo.',
    periodo: 'Século XX',
    dataOuAno: '1922',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    curiosidade: 'O evento rompeu com o academicismo e inaugurou o movimento Antropofágico.',
    status: 'PUBLICADO',
    ordem: 3,
    dataCriacao: '2026-01-03T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'hist_4',
    titulo: 'Revolução Constitucionalista de 1932',
    descricao: 'Movimento armado dos paulistas exigindo uma nova Constituição democrática para o Brasil.',
    periodo: 'Século XX',
    dataOuAno: '1932',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    curiosidade: 'O Obelisco do Ipiranga e o dia 9 de Julho (feriado estadual) homenageiam os heróis de 32.',
    status: 'PUBLICADO',
    ordem: 4,
    dataCriacao: '2026-01-04T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_CURIOSIDADES: CuriosidadeVoceSabia[] = [
  {
    id: 'cur_1',
    titulo: 'Por que São Paulo é chamada de "A Terra da Garoa"?',
    descricao: 'Devido ao antigo microclima do planalto de Piratininga, onde o ar úmido que subia da Serra do Mar criava uma fina neblina constante pela manhã.',
    pergunta: 'Por que São Paulo é chamada de "A Terra da Garoa"?',
    resposta: 'Devido ao antigo microclima do planalto de Piratininga, onde o ar úmido que subia da Serra do Mar criava uma fina neblina constante pela manhã. Hoje, com a urbanização, a garoa ficou mais rara!',
    categoria: 'Clima e Geografia',
    cidadeOuRegiao: 'São Paulo (Capital)',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    status: 'PUBLICADO',
    ordem: 1,
    dataCriacao: '2026-01-10T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cur_2',
    titulo: 'A Suíça e a Holanda em terras paulistas',
    descricao: 'Campos do Jordão e Holambra trazem paisagens e arquitetura europeias para o Estado de São Paulo.',
    pergunta: 'Você sabia que o estado de São Paulo tem a sua própria "Suíça" e a sua própria "Holanda"?',
    resposta: 'Sim! Campos do Jordão na Mantiqueira possui arquitetura suíça alpina, enquanto Holambra na região de Campinas foi fundada por imigrantes holandeses e produz 45% de todas as flores do Brasil!',
    categoria: 'Cidades e Turismo',
    cidadeOuRegiao: 'Campos do Jordão & Holambra',
    status: 'PUBLICADO',
    ordem: 2,
    dataCriacao: '2026-01-11T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  },
  {
    id: 'cur_3',
    titulo: 'O maior parque temático da América Latina',
    descricao: 'O Hopi Hari fica localizado no município paulista de Vinhedo.',
    pergunta: 'Qual é o maior parque de diversões da América Latina localizado em São Paulo?',
    resposta: 'O Hopi Hari, localizado às margens da Rodovia dos Bandeirantes no município de Vinhedo, com uma área de 760 mil metros quadrados!',
    categoria: 'Turismo e Lazer',
    cidadeOuRegiao: 'Vinhedo / RMC',
    status: 'PUBLICADO',
    ordem: 3,
    dataCriacao: '2026-01-12T10:00:00Z',
    dataAtualizacao: '2026-09-29T10:00:00Z'
  }
];

export const INITIAL_QUIZ: PerguntaQuiz[] = [
  {
    id: 'qz_1',
    pergunta: 'Em que ano e por quem foi fundada a cidade de São Paulo?',
    alternativaA: '1500 por Pedro Álvares Cabral',
    alternativaB: '1554 pelos padres Manuel da Nóbrega e José de Anchieta',
    alternativaC: '1822 por D. Pedro I',
    alternativaD: '1922 pelos artistas modernistas',
    respostaCorreta: 'B',
    explicacao: 'São Paulo foi fundada em 25 de janeiro de 1554 por padres jesuítas liderados por Manuel da Nóbrega e José de Anchieta no Pátio do Colégio.',
    categoria: 'História',
    dificuldade: 'Fácil',
    status: 'PUBLICADO',
    ordem: 1
  },
  {
    id: 'qz_2',
    pergunta: 'Qual prato tradicional paulista foi reconhecido como Patrimônio Imaterial do Estado de São Paulo?',
    alternativaA: 'Feijoada Completa',
    alternativaB: 'Moqueca Capixaba',
    alternativaC: 'Virado à Paulista',
    alternativaD: 'Barreado',
    respostaCorreta: 'C',
    explicacao: 'O Virado à Paulista, criado nas expedições dos Bandeirantes no século XVI, foi tombado como Patrimônio Cultural Imaterial pelo Condephaat.',
    categoria: 'Gastronomia',
    dificuldade: 'Fácil',
    status: 'PUBLICADO',
    ordem: 2
  },
  {
    id: 'qz_3',
    pergunta: 'Qual museu icônico da Avenida Paulista é famoso pelo seu vão livre de 74 metros idealizado por Lina Bo Bardi?',
    alternativaA: 'Museu do Ipiranga',
    alternativaB: 'MASP (Museu de Arte de São Paulo)',
    alternativaC: 'Pinacoteca do Estado',
    alternativaD: 'MIS (Museu da Imagem e do Som)',
    respostaCorreta: 'B',
    explicacao: 'O MASP foi projetado pela arquiteta Lina Bo Bardi e inaugurado em 1968 com seu famoso vão sustentado por quatro pilares vermelhos.',
    categoria: 'Turismo',
    dificuldade: 'Fácil',
    status: 'PUBLICADO',
    ordem: 3
  },
  {
    id: 'qz_4',
    pergunta: 'Qual cidade paulista é conhecida nacionalmente como a "Capital Nacional das Flores"?',
    alternativaA: 'Atibaia',
    alternativaB: 'Campos do Jordão',
    alternativaC: 'Holambra',
    alternativaD: 'Cunha',
    respostaCorreta: 'C',
    explicacao: 'Holambra (cujo nome une Holanda + América + Brasil) produz quase metade das flores e plantas ornamentais comercializadas no Brasil.',
    categoria: 'Cidades',
    dificuldade: 'Médio',
    status: 'PUBLICADO',
    ordem: 4
  },
  {
    id: 'qz_5',
    pergunta: 'O que ocorreu de histórico em São Paulo no ano de 1922 no Theatro Municipal?',
    alternativaA: 'Proclamação da República',
    alternativaB: 'Semana de Arte Moderna',
    alternativaC: 'Inauguração da Feira Cultural',
    alternativaD: 'Abertura do Porto de Santos',
    respostaCorreta: 'B',
    explicacao: 'A Semana de Arte Moderna de 1922 marcos o início do Modernismo na arte, literatura e arquitetura brasileiras.',
    categoria: 'Cultura',
    dificuldade: 'Médio',
    status: 'PUBLICADO',
    ordem: 5
  }
];

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm_1', label: 'Início', path: '/', icone: 'Home', ordem: 1, status: 'PUBLICADO' },
  { id: 'm_2', label: 'Mapa SP', path: '/#mapa', icone: 'Map', ordem: 2, status: 'PUBLICADO' },
  { id: 'm_3', label: 'Cidades', path: '/#cidades', icone: 'Building2', ordem: 3, status: 'PUBLICADO' },
  { id: 'm_4', label: 'Pontos Turísticos', path: '/#pontos', icone: 'Camera', ordem: 4, status: 'PUBLICADO' },
  { id: 'm_5', label: 'Av. Paulista', path: '/#paulista', icone: 'Landmark', ordem: 5, status: 'PUBLICADO' },
  { id: 'm_6', label: 'Mercadão', path: '/#mercadao', icone: 'ShoppingBag', ordem: 6, status: 'PUBLICADO' },
  { id: 'm_7', label: 'Liberdade', path: '/#liberdade', icone: 'Compass', ordem: 7, status: 'PUBLICADO' },
  { id: 'm_8', label: 'Culinária', path: '/#culinaria', icone: 'Utensils', ordem: 8, status: 'PUBLICADO' },
  { id: 'm_9', label: 'Artesanato', path: '/#artesanato', icone: 'Palette', ordem: 9, status: 'PUBLICADO' },
  { id: 'm_10', label: 'História', path: '/#historia', icone: 'History', ordem: 10, status: 'PUBLICADO' },
  { id: 'm_11', label: 'Quiz', path: '/#quiz', icone: 'Award', ordem: 11, status: 'PUBLICADO' },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b_1',
    titulo: 'FEIRA CULTURAL DO COLÉGIO SIMETRIA',
    subtitulo: 'SÃO PAULO — CULTURA, HISTÓRIA E DIVERSIDADE',
    imagem: '/images/sp_hero_banner_1790701710531.jpg',
    botaoTexto: 'EXPLORAR O ESTADO',
    botaoLink: '#mapa',
    ordem: 1,
    status: 'PUBLICADO'
  }
];

export const INITIAL_SECOES: SecaoSite[] = [
  { id: 'sec_1', titulo: 'Mapa Interativo de São Paulo', subtitulo: 'Explore as regiões e cidades', descricao: 'Selecione no mapa para descobrir a história e os segredos de cada canto do estado.', icone: 'Map', ordem: 1, status: 'PUBLICADO', cor: '#3B82F6', layout: 'DESTAQUE_HERO', chaveSecao: 'mapa' },
  { id: 'sec_2', titulo: 'Cidades Paulistas', subtitulo: 'Diversidade do litoral ao interior', descricao: 'Conheça a história, população e vocação turística das principais cidades de SP.', icone: 'Building2', ordem: 2, status: 'PUBLICADO', cor: '#10B981', layout: 'GRID', chaveSecao: 'cidades' },
  { id: 'sec_3', titulo: 'Pontos Turísticos', subtitulo: 'Os destinos mais visitados', descricao: 'Museus, parques, igrejas históricas e obras arquitetônicas fantásticas.', icone: 'Camera', ordem: 3, status: 'PUBLICADO', cor: '#F59E0B', layout: 'GRID', chaveSecao: 'pontos' },
  { id: 'sec_4', titulo: 'Especial Avenida Paulista', subtitulo: 'O coração pulsante de São Paulo', descricao: 'Conheça a linha do tempo e os segredos da avenida mais famosa do Brasil.', icone: 'Landmark', ordem: 4, status: 'PUBLICADO', cor: '#EF4444', layout: 'DESTAQUE_HERO', chaveSecao: 'paulista' },
  { id: 'sec_5', titulo: 'Mercadão Municipal', subtitulo: 'Sabores e aromas do Brasil', descricao: 'Iguarias, frutas raras, doces e a famosa gastronomia do Mercadão de SP.', icone: 'ShoppingBag', ordem: 5, status: 'PUBLICADO', cor: '#EC4899', layout: 'GRID', chaveSecao: 'mercadao' },
  { id: 'sec_6', titulo: 'Bairro da Liberdade', subtitulo: 'Imersão cultural asiática', descricao: 'Tradição japonesa, chinesa e coreana no coração da capital paulista.', icone: 'Compass', ordem: 6, status: 'PUBLICADO', cor: '#8B5CF6', layout: 'DESTAQUE_HERO', chaveSecao: 'liberdade' },
  { id: 'sec_7', titulo: 'Gastronomia & Culinária Paulista', subtitulo: 'Sabor caipira, caiçara e metropolitano', descricao: 'Do Virado à Paulista ao pastel de feira e receitas do litoral.', icone: 'Utensils', ordem: 7, status: 'PUBLICADO', cor: '#F97316', layout: 'GRID', chaveSecao: 'culinaria' },
  { id: 'sec_8', titulo: 'Artesanato Paulista', subtitulo: 'Arte popular e saberes tradicionais', descricao: 'Esculturas em madeira, cerâmica de Taubaté e peças tradicionais.', icone: 'Palette', ordem: 8, status: 'PUBLICADO', cor: '#06B6D4', layout: 'GRID', chaveSecao: 'artesanato' },
  { id: 'sec_9', titulo: 'Cultura e Tradições', subtitulo: 'Música, manifestações e saberes', descricao: 'Samba paulista, orquestras de viola, literatura e festas populares.', icone: 'Sparkles', ordem: 9, status: 'PUBLICADO', cor: '#14B8A6', layout: 'GRID', chaveSecao: 'cultura' },
  { id: 'sec_10', titulo: 'Linha do Tempo da História', subtitulo: 'Dos Bandeirantes aos dias atuais', descricao: 'Marcos históricos decisivos da construção do Estado de São Paulo.', icone: 'History', ordem: 10, status: 'PUBLICADO', cor: '#6366F1', layout: 'LISTA', chaveSecao: 'historia' },
  { id: 'sec_11', titulo: 'Você Sabia? (Curiosidades)', subtitulo: 'Fatos surpreendentes sobre SP', descricao: 'Desvende perguntas e respostas impressionantes sobre o estado.', icone: 'HelpCircle', ordem: 11, status: 'PUBLICADO', cor: '#A855F7', layout: 'CAROUSEL', chaveSecao: 'curiosidades' },
  { id: 'sec_12', titulo: 'Quiz da Feira Cultural', subtitulo: 'Teste seus conhecimentos', descricao: 'Responda as perguntas, acumule pontos e conquiste seu certificado oficial!', icone: 'Award', ordem: 12, status: 'PUBLICADO', cor: '#EAB308', layout: 'DESTAQUE_HERO', chaveSecao: 'quiz' },
];

export const INITIAL_APARENCIA: ConfigAparencia = {
  modoTema: 'escuro',
  tema: 'FUTURISTA',
  corPrimaria: '#3B82F6',
  corSecundaria: '#8B5CF6',
  corFundo: '#090D16',
  corBotoes: '#F59E0B',
  tipografia: 'Plus Jakarta Sans',
  tamanhoFonte: 'Padrão',
  estiloBorda: 'Suave',
  estiloCard: 'Glassmorphism',
  intensidadeEfeitos: 'Alta',
  animacoesAtivas: true
};

export const INITIAL_IDENTIDADE: ConfigIdentidade = {
  nomeColegio: 'COLÉGIO SIMETRIA',
  logoUrl: '/logo-simetria.jpg',
  logoCarregamentoUrl: '/logo-simetria.jpg',
  faviconUrl: '/logo-simetria.jpg',
  nomeFeira: 'FEIRA CULTURAL 2026',
  anoFeira: '2026',
  tituloPrincipal: 'SÃO PAULO: CULTURA, HISTÓRIA E DIVERSIDADE',
  subtituloPrincipal: 'Um projeto interdisciplinar do Colégio Simetria celebrando a riqueza do Estado de São Paulo.',
  textoInstitucional: 'A Feira Cultural do Colégio Simetria reúne o talento e a pesquisa dos nossos alunos em uma jornada interativa pela história, gastronomia, arte, arquitetura e atrativos do Estado de São Paulo.'
};

export const INITIAL_MODO_FEIRA: ConfigModoFeira = {
  ativo: false,
  tempoTransicaoSegundos: 8,
  secoesExibidas: ['cidades', 'paulista', 'mercadao', 'liberdade', 'culinaria', 'artesanato', 'historia'],
  velocidadeAnimacoes: 'Normal',
  telaCheiaAuto: false,
  autoplay: true,
  intervaloConteudosSegundos: 10,
  efeitosSonorosAtivos: true,
  audioVolume: 0.5
};

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm_1',
    nome: 'Direção Colégio Simetria',
    email: 'admin@simetria.edu.br',
    role: 'SUPER_ADMIN',
    ativo: true,
    dataCriacao: '2026-01-01T10:00:00Z',
    ultimoAcesso: '2026-09-29T10:00:00Z'
  },
  {
    id: 'adm_2',
    nome: 'Professor de História (Editor)',
    email: 'editor@simetria.edu.br',
    role: 'EDITOR',
    ativo: true,
    dataCriacao: '2026-02-15T10:00:00Z',
    ultimoAcesso: '2026-09-28T14:30:00Z'
  }
];

export const INITIAL_LOGS: LogAlteracao[] = [
  {
    id: 'log_1',
    usuarioEmail: 'admin@simetria.edu.br',
    usuarioNome: 'Direção Colégio Simetria',
    acao: 'Atualizou as configurações visuais do tema',
    conteudoAfetado: 'Aparência e Identidade do Site',
    tipoEntidade: 'Configuração',
    dataHora: '2026-09-29T09:15:00Z'
  },
  {
    id: 'log_2',
    usuarioEmail: 'admin@simetria.edu.br',
    usuarioNome: 'Direção Colégio Simetria',
    acao: 'Cadastrou nova cidade no mapa',
    conteudoAfetado: 'Aparecida (Vale do Paraíba)',
    tipoEntidade: 'Cidade',
    dataHora: '2026-09-28T16:20:00Z'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med_1',
    nome: 'sp_hero_banner',
    url: '/images/sp_hero_banner_1790701710531.jpg',
    tamanhoKb: 450,
    formato: 'JPG',
    categoria: 'Banners',
    cidadeOuRegiao: 'São Paulo',
    textoAlternativo: 'Skyline da cidade de São Paulo ao entardecer',
    legenda: 'Vista panorâmica da metrópole paulistana',
    dataUpload: '2026-01-10T10:00:00Z'
  },
  {
    id: 'med_2',
    nome: 'simetria_logo_badge',
    url: '/images/simetria_logo_badge_1790701719844.jpg',
    tamanhoKb: 210,
    formato: 'JPG',
    categoria: 'Logos',
    cidadeOuRegiao: 'Geral',
    textoAlternativo: 'Brasão do Colégio Simetria',
    legenda: 'Identidade oficial da Feira Cultural',
    dataUpload: '2026-01-10T10:00:00Z'
  },
  {
    id: 'med_3',
    nome: 'paulista_avenue',
    url: '/images/paulista_avenue_1790701728460.jpg',
    tamanhoKb: 520,
    formato: 'JPG',
    categoria: 'Avenida Paulista',
    cidadeOuRegiao: 'São Paulo',
    textoAlternativo: 'Avenida Paulista e MASP sob luz solar',
    legenda: 'O maior polo cultural aberto da América Latina',
    dataUpload: '2026-01-10T10:00:00Z'
  },
  {
    id: 'med_4',
    nome: 'mercadao_sp',
    url: '/images/mercadao_sp_1790701738265.jpg',
    tamanhoKb: 480,
    formato: 'JPG',
    categoria: 'Mercadão',
    cidadeOuRegiao: 'São Paulo',
    textoAlternativo: 'Vitrais e bancadas do Mercadão Municipal',
    legenda: 'Centro gastronômico histórico de São Paulo',
    dataUpload: '2026-01-10T10:00:00Z'
  },
  {
    id: 'med_5',
    nome: 'liberdade_japantown',
    url: '/images/liberdade_japantown_1790701747719.jpg',
    tamanhoKb: 390,
    formato: 'JPG',
    categoria: 'Liberdade',
    cidadeOuRegiao: 'São Paulo',
    textoAlternativo: 'Lanternas suzuran e Torii no bairro da Liberdade',
    legenda: 'O bairro de herança japonesa e asiática',
    dataUpload: '2026-01-10T10:00:00Z'
  }
];

export const INITIAL_MURAL_FOTOS: FotoMural[] = [
  {
    id: 'mural_1',
    autorNome: 'Família Oliveira & Lucas (7º Ano)',
    turmaOuRelacao: 'Família',
    mensagem: 'Incrível ver a dedicação dos alunos! O estande da Avenida Paulista e a maquete do MASP ficaram perfeitos! Parabéns Colégio Simetria! 👏❤️',
    fotoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    curtidas: 42,
    dataCriacao: '2026-10-01T14:20:00Z',
    localFeira: 'Estande Av. Paulista',
    destaque: true
  },
  {
    id: 'mural_2',
    autorNome: 'Beatriz, Mariana e Sofia',
    turmaOuRelacao: 'Estudante 3º Ano',
    mensagem: 'Nossa equipe do Bairro da Liberdade com as luminárias Suzuran! Venham provar os doces e participar da oficina de origami! 🏮🌸✨',
    fotoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
    curtidas: 58,
    dataCriacao: '2026-10-01T14:45:00Z',
    localFeira: 'Bairro da Liberdade',
    destaque: true
  },
  {
    id: 'mural_3',
    autorNome: 'Carlos Eduardo (Pai da Isabella)',
    turmaOuRelacao: 'Visitante',
    mensagem: 'O pastel de bacalhau e a mini degustação de frutas exóticas do Mercadão estavam espetaculares! Que feira caprichada!',
    fotoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',
    curtidas: 35,
    dataCriacao: '2026-10-01T15:10:00Z',
    localFeira: 'Mercadão Municipal'
  },
  {
    id: 'mural_4',
    autorNome: 'Professora Helena & Equipe de História',
    turmaOuRelacao: 'Professor',
    mensagem: 'Orgulho imenso de ver nossos estudantes compartilhando a história e cultura paulista com tanto entusiasmo e propriedade!',
    fotoUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    curtidas: 73,
    dataCriacao: '2026-10-01T13:30:00Z',
    localFeira: 'Área Geral',
    destaque: true
  },
  {
    id: 'mural_5',
    autorNome: 'Turma do 9º Ano B',
    turmaOuRelacao: 'Estudante',
    mensagem: 'Foto oficial da turma com a bandeira de SP e o troféu do Quiz Cultural! Valeu a pena cada noite de pesquisa! 🏆🥇',
    fotoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    curtidas: 61,
    dataCriacao: '2026-10-01T15:35:00Z',
    localFeira: 'Estande Av. Paulista'
  }
];

