import { Tilt } from "@/components/ui/tilt";

function BasicTiltCard() {
  return (
    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
      <div
        style={{
          borderRadius: '12px',
        }}
        className='flex max-w-[270px] flex-col overflow-hidden border border-border bg-card'
      >
        <img
          src='https://images.beta.cosmos.so/f7fcb95d-981b-4cb3-897f-e35f6c20e830?format=jpeg'
          alt='Ghost in the shell - Kôkaku kidôtai'
          className='h-48 w-full object-cover'
        />
        <div className='p-2'>
          <h1 className='font-mono leading-snug text-card-foreground text-sm line-clamp-2'>
            Ghost in the Shell
          </h1>
          <p className='text-muted-foreground text-xs'>Kôkaku kidôtai</p>
        </div>
      </div>
    </Tilt>
  );
}

function TiltSpotlight() {
  return (
    <div className='aspect-video max-w-sm'>
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        style={{
          transformOrigin: 'center center',
        }}
        className='group relative rounded-lg'
      >
        <img
          src='https://images.beta.cosmos.so/40fbc749-6796-485b-9588-20204dd7c8f0?format=jpeg'
          alt='Ghost in the shell - Kôkaku kidôtai'
          className='h-32 w-full rounded-lg object-cover grayscale duration-700 group-hover:grayscale-0'
        />
      </Tilt>
      <div className='flex flex-col space-y-0.5 pb-0 pt-3'>
        <h3 className='font-mono text-sm font-medium text-foreground'>
          2001: A Space Odyssey
        </h3>
        <p className='text-xs text-muted-foreground'>Stanley Kubrick</p>
      </div>
    </div>
  );
}

export { BasicTiltCard, TiltSpotlight };