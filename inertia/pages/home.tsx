import { Head, Link } from '@inertiajs/react'


export default function Home() {
  return (
    <>
      <Head title="Race Track" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Logo */}
            <svg width="200" height="200" viewBox="0 0 2048 2048" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <path d="M1112.56 742.52C1137.5 742.52 1168.43 741.731 1193.36 741.291L1248.05 740.343C1257.56 740.227 1267.48 739.521 1276.9 740.556C1276.86 742.975 1275.19 744.317 1273.75 746.208C1250.55 783.615 1224.05 819.706 1199.22 856.096C1190.25 869.248 1180.23 882.315 1172.24 896.065C1174.23 897.375 1175.91 897.48 1178.21 897.805C1185.53 895.218 1259.91 896.217 1272.37 896.941L1256.73 918.041L1170.55 1031.62C1163.56 1040.83 1149.38 1062.73 1141.85 1069.25L1134.6 1079.14C1131.29 1083.43 1128.09 1088.24 1124.28 1092.08C1101.5 1125 1085.6 1143 1064.23 1177.8C1055.17 1189.46 1035.6 1222.03 1023 1228.5C1021.25 1229.4 1017.53 1228.04 1016.4 1226.69C1014.66 1224.61 1014.82 1221.64 1015.39 1219.16C1016.37 1214.89 1018.39 1211.21 1019.88 1207.13C1046.58 1133.39 1076.8 1058.1 1108.39 986.207C1098.51 986.163 1088.63 986.065 1078.75 985.911C1061.44 986.55 1043.93 986.031 1026.59 986.032C1030.54 952.504 1099.5 777 1112.56 742.52Z" fill="url(#paint0_linear_44689_2672)"/>
              <defs>
                <linearGradient id="paint0_linear_44689_2672" x1="825.5" y1="1031" x2="1047.79" y2="779.83" gradientUnits="userSpaceOnUse">
                  <stop offset="0.035" stopColor="#FFB30F"/>
                  <stop offset="0.505" stopColor="#FFBA06"/>
                  <stop offset="1" stopColor="#D73E47"/>
                </linearGradient>
              </defs>
            </svg>

            <h1 className="text-4xl font-bold mb-12">Welcome to Race Track</h1>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
              {/* Notes Card */}
              <Link href="/notes" className="block">
                <div className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                  <h2 className="text-2xl font-semibold mb-3">Notes</h2>
                  <p className="text-gray-400">Manage your notes and thoughts in one place</p>
                </div>
              </Link>

              {/* Projects Card */}
              <Link href="/projects" className="block">
                <div className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                  <h2 className="text-2xl font-semibold mb-3">Projects</h2>
                  <p className="text-gray-400">Track your projects and their progress</p>
                </div>
              </Link>

              {/* Todos Card */}
              <Link href="/todos" className="block">
                <div className="bg-[#2C2C2E] p-6 rounded-xl hover:bg-[#3C3C3E] transition-colors duration-200">
                  <h2 className="text-2xl font-semibold mb-3">Todos</h2>
                  <p className="text-gray-400">Keep track of your tasks and stay organized</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}