#include <iostream>
#include <string>
#include <fstream>
#include <vector>

using namespace std;

int main(int argc, char** argv)
{
    if (argc != 2) { cout << "There aren't any arguments or there are more arguments than we expected."; }
    else {
        ifstream file(argv[1]);
        string line;
        vector<double> xk;
        vector<double> hk;
        int k = 0;
        double h0;
        double vx;
        double vy;
        // считываем построчно, k - счетчик номера строки
        while (getline(file, line)) {
            k++;
            if (k == 1) { h0 = stod(line); }
            if (k == 2) {
                vx = stod(line.substr(0, line.find(' ')));
                vy = stod(line.substr(line.find(' ') + 1));
            } else {
                if ((k != 1) && (line.length() > 0)) {
                    xk.push_back(stod(line.substr(0, line.find(' '))));
                    hk.push_back(stod(line.substr(line.find(' ') + 1)));
                }
            }
        }
        // надо проверить, может перегородок нет, и поэтому сразу вывести нулевую зону
        int answer = 0; // нулевая зона
        if (xk.size() == 0) {cout << answer; return 0;}
        double g = 9.81;
        double h = h0;
        int i = -1;
        double t;
        int i_prev;
        // смотрим в зоне каждой перегородки высоту нашего летящего тела
        while (h > 0) {
            do {
                i++;
                if (i == 0) { t = xk[i] / vx; }
                else {
                    t = (xk[i] - xk[i_prev]) / vx;
                }
                h = h0 + vy * t - g * t * t / 2;
                h0 = h;
                vy = vy - g * t;
                i_prev = i;
            } while ((h > hk[i]) && (i < xk.size() - 1));
            if (h <= 0) {
                answer = i;
                break;
            }
            if (h > hk[i] && i == xk.size() - 1) {
                answer = xk.size();
                break;
            }
            else { vx = -vx; }
            // значит столкнулись с чем-то, если дошли до сюда
            do {
                i--;
                t = (xk[i] - xk[i_prev]) / vx;
                h = h0 + vy * t - g * t * t / 2;
                h0 = h;
                vy = vy - g * t;
                i_prev = i;
            } while (h > hk[i] && i > 0);
            if (h <= 0) {
                answer = i_prev + 1;
                break;
            }
            if (h > hk[i] && i == 0) {
                answer = 0;
                break;
            }
            else { vx = -vx; }
        }
        cout << answer;
    }
    return 0;
}





