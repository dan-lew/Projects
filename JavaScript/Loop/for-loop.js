// print numbers between 1 and 100 + 9
for (let i = 1; i <= 100; i++) {

    console.log(i + " + 9 = " + i * 9);
}
// the Grade Assigner
// if the result > 89 then you get A
// if the result > 80 then you get B
// if the result > 70 then you get C
// if the result > 65 then you get D
// if the result < 65 then you get F
for (let i = 100; i >= 1; i--) {

    if (i > 89) {
        console.log(i + " you get A");
    }
    else if (i > 80) {
        console.log(i + " you get B");
    }
    else if (i > 70) {
        console.log(i + " you get C");
    }
    else if (i > 65) {
        console.log(i + " you get D");
    }
    else {
        console.log(i + " you get F")
    }
}
///////////////////////////////////////////////
// print 100 stars, 10 stars in each row
for (let i = 1; i <= 100; i++) {
    document.write(' * ');
    if (i % 10 == 0) {
        document.write('<br>');
    }
}
//////////////////////////////
for (i = 0; i < 10; i++) {

    for (let c = 0; c < 10; c++) {
        document.write(' + ');
    }
    document.write('<br>');
}