---
tags:
    - php
---


オモニ　パイザ

```php
<?php
$inputLines = [];
while($inputLine = trim(fgets(STDIN))){ // Loop while string exists
    $inputLines[] = explode(' ', $inputLine); // Split on space, and push
}

// Assign inputs to var
$N = (int)$inputLines[0][0];

$toInt = function(string $a): int{return (int)$a;};
$strs = [];
for ($i = 0; $i < $N; $i++) {
    $strs[] = array_map($toInt, $inputLines[1 + $i]);
}

// print all elements
for ($i = 0; $i < count($inputLines); $i++) {
    for ($j = 0; $j < count($inputLines[$i]); $j++) {
         echo $inputLines[$i][$j].' ';
    }
    echo "\\n";
}
var_dump($inputLines);
?>
```

a