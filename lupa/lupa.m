original_image = imread('butterfly.jpg');
[n m c] = size(original_image);

assert(c == 3);

angles = linspace(0, 20 * pi, 1000);
for i=1:length(angles)
    radius = 200;
    c = 0.5 + sin(angles(i)) / 2;
    [x y] = meshgrid(1:m, 1:n);
    center = [radius, 200];
    dy = y - center(1);
    dx = x - center(2);
    r0 = hypot(dx, dy) ./ radius * 2;
    quot = c ./ sqrt(1 - r0.^2);
    quot(r0.^2 > sqrt(1 - c^2)) = 1;
    nx = center(1) + round(dx .* quot);
    ny = center(2) + round(dy .* quot);
    idx = n * (nx - 1) + ny;
    new_image = reshape(original_image([idx(:); m*n+idx(:); 2*m*n+idx(:)]), n, m, 3);
    
    imshow(new_image);
    pause(0.01);
end

