```glsl
float rand(float a) {
    float b = fract(cos(sin(a)));
    return b;
}

vec3 CodeLines(vec2 fragCoord, float reps, vec3 baseCol, float sm) {
    fragCoord.x -= mod(fragCoord.x, reps);
    
    float offset = sin(fragCoord.x*15.);
    float speed = (cos(fragCoord.x*1.)*.1+sm);
    float vrep = rand(fragCoord.x);

    float y = fract((fragCoord.y/iResolution.y)*vrep + offset + iTime*speed);
    return baseCol / (y*20.); //(0.2, 1., .2)
}

float Chars(vec2 fragCoord, float reps) {
    vec2 uv = mod(fragCoord.xy, reps)*.0625;
    vec2 id = fragCoord*.0625 - uv;
    uv += floor(texture(iChannel1, id/iChannelResolution[1].xy + iTime*.00002).xy*(reps*2.));
    uv *= .0625;
    uv.x = -uv.x;
    return texture(iChannel0, uv).r;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy/iResolution.xy;
    vec3 col = CodeLines(fragCoord, 4., vec3(.2, .8, .2), .15)*Chars(fragCoord, 8.);
    col += CodeLines(fragCoord, 8., vec3(.05, .75, .25), .25)*Chars(fragCoord, 16.);
    col *= (texture(iChannel1, uv).rgb *2.);

    fragColor = vec4(col,1.0);
}



```