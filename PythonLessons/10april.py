import time
import asyncio

async def fun1(x):
    # print(x**2)
    await asyncio.sleep(3)
    # print('fun1 завершена')
    return x**2

async def fun2(x):
    print(x**0.5)
    await asyncio.sleep(3)
    print('fun2 завершена')
    
def fun3(x):
    print(x**5)
    print('fun3 завершена')

async def main():
    task1 = asyncio.create_task(fun1(4))
    task2 = asyncio.create_task(fun2(4))

    # print(task1.__class__.__bases__)
    # print(type(fun1(5)))
    await task1
    await task2

print(time.strftime('%X'))

asyncio.run(main())

print(time.strftime('%X'))
# print(type(fun1))
# print(type(fun1(4)))