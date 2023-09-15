# решаем диффур на каждом шаге для N частиц
import time ## для того чтобы посмотреть сколько времени прошло
import asyncio
# класс для частицы
class PRT():
    def __init__(self,x,u = 0.,v = 0.):
        self.x = x
        self.u = u
        self.v = v

def count(NUM): # функция, которая создаем массив из частиц PRT в количестве NUM
    for i in range(NUM):
        PRTS.append(PRT(float(i))) 

async def phys():
    # сначала считаем скорости 
    # для первой 
    PRTS[0].v = omega_q*(PRTS[-1].u - 2*PRTS[0].u + PRTS[1].u)*dt
    for i in range(N-2):
        PRTS[i+1].v = omega_q*(PRTS[i+2].u - 2*PRTS[i+1].u + PRTS[i].u)*dt
    PRTS[N-1].v = omega_q*(PRTS[N-2].u - 2*PRTS[N-1].u + PRTS[1].u)*dt

    tasks = []
    # считаем перемещения
    for j in range(N):
        tasks.append(asyncio.create_task(find_u(j)))

    for task in tasks:
        await task

async def find_u(o):
    PRTS[o].u = PRTS[o].v*dt

def draw():
    pass

if __name__ == "__main__":
    
    N = 1000
    C = 100
    m = 1
    omega_q = (C/m)
    dt = 0.05*6.28/(omega_q**(1/2))
    PRTS = []
    count(N)
    time1 = time.time()
    for k in range(10000):
        asyncio.run(phys())

    time2 = time.time()
    print('Время:'+str(time2-time1))