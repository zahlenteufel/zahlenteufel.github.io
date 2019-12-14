c  = 0.2;
f  = @(z) sqrt(1 - z.^2) - c;
x0 = -0.87;
x1 = c * x0 / sqrt(1 - x0^2);

clf
hold on
axis equal
axis off

x = linspace(-1, 1, 100);
plot(x, f(x), 'b');
plot(x, 0*x, 'k-');
line([x0 x1], [f(x0) 0], 'Color', 'r', 'LineStyle', '--');
line([ 0 x1], [-c    0], 'Color', 'r', 'LineStyle', ':');
plot(x1, 0, 'ro', 'MarkerSize', 5);
plot(0, -c, 'r+');

pause