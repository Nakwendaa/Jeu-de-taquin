/* Auteurs:
 Samuel GUIGUI
 Paul CHAFFANET - 1009543 */

var imgURL,
    nb_col, nb_lignes,
    height, width,

/* Variable de fin de partie. Si true, alors les déplacements sont interdits. Si false, cela signifie que les
   déplacements ont été autorisés, car les cartes ont été brassées (ce qui signifie le début d'une partie). */
    fin = true;


/* Fonction permettant de mélanger de manière aléatoire un tableau.
 * J'ai pris le code de cette fonction ici:
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

$(function () {

    var afficher= $('#afficher');
    var img_src = $('#img_src');
    var score = $('#score');

    var container = $('#container');
    var ligne;
    var tuile;
    var case_g;
    var numero;



    /* Fonction pour swapper deux élément html avec JQuery que j'ai prise ici (3ème réponse):
     * https://stackoverflow.com/questions/698301/is-there-a-native-jquery-function-to-switch-elements
     */
    jQuery.fn.swapWith = function(to) {
        return this.each(function() {
            var copy_to = $(to).clone(true);
            var copy_from = $(this).clone(true);
            $(to).replaceWith(copy_from);
            $(this).replaceWith(copy_to);
        });
    };

    $("#affichage_num").click(function () {
        if ($(this).is(':checked')) {
            $(".num").css("visibility", "visible");
        }
        else {
            $(".num").css("visibility", "hidden");
        }
    });


    afficher.click(function () {
        /* On ne peut pas effectuer de déplacement tant que les tuiles n'ont pas été brassées. Ainsi, lorsque l'on
         * clique sur le bouton "afficher", on doit mettre la variable fin à true. */
        fin = true;
        tuile = $(".tuile");
        ligne = $(".ligne");

        /* Mettre le score de déplacements à 0. Cliquer sur "Afficher" cause la fin de la partie en cours. */
        score.text("0");
        /* On retire toutes les tuiles et lignes qui ont été affichées précedemment car on se prépare à afficher
         * une nouvelle grille. */
        if (tuile.length > 0) {
            tuile.remove();
        }

        if (ligne.length > 0) {
            ligne.remove();
        }
        /* On récupère l'url de l'image source que l'usager souhaite afficher et qu'il a entré dans l'input img_src */
        imgURL = img_src.val();
        /* On récupère également la valeurs des champs lignes et colonnes pour savoir combien de tuiles on doit
        * afficher. */
        nb_col = parseInt($("#nb_colonnes").val());
        nb_lignes = parseInt($("#nb_lignes").val());

        /* On a fait le choix d'obliger qu'une image ait un format 1024 * 600 afin de pouvoir accepter des images de
         * tailles diverses.
         * Ainsi, la largeur et la hauteur d'une <div> sera d'environ 1024/ nb_col et 600 / nb_lignes.
         * Pourquoi environ? Car lorsqu'il viendra le temps d'assigner la hauteur et la longueur à une <div>, il ne faut
         * pas oublier que pour avoir une <div> #container de 1024 * 600, il faut compter les marges entre chaque
         * tuile à l'intérieur de la div container. Plus précisément, pour 1px de marge en haut, et 1 px de marge en bas,
         * on doit retirer donc 2 px à height. Également, 1px de marge à gauche et 1 px de marge à droite, soit 2px
         * de marge qui doivent être retranchés à width. Ainsi, on obtiendra une <div> container de 1024 * 600.*/
        width = 1024 / nb_col;
        height = 600 / nb_lignes;

        // Ajouter les lignes dans une boucle pour atteindre 600px de container
        // Ajouter les colonnes dans une boucle, pour chaque ligne, atteindre 1024
        for (var i = 0; i < nb_lignes; i++) {
            container.append("<tr class='ligne'></tr>");
        }
        ligne = $(".ligne");
        // Ligne sera de type bloc dans le container.
        ligne.css({"display" : "block"});

        var num = 0;
        for (i = 1; i < nb_lignes + 1; i++) {
            for (var j = 0; j < nb_col; j++) {
                $(".ligne:nth-child(" + i + ")").append("<td class='tuile'><span class='num'>" + ++num + "</span></td>");
            }
        }
        numero = $(".num");
        tuile = $(".tuile");


        /* On met l'img_src en 1024 * 600 afin que ce soit cohérent avec la taille de grille définie plus haut (puisque
        * la largeur (width) et la hauteur (height) de nos <div> sont calculés par rapport à 1024 * 600.)*/
        tuile.css("background-image", "url(" + imgURL + ")");
        /* Seulement le contenu doit être bg */
        tuile.css("background-origin", "content-box");
        tuile.css("background-repeat", "no-repeat");
        /* Forcer 1024 * 600 */
        tuile.css("background-size", "1024px 600px");
        tuile.css("display", "inline-block");
        tuile.css("margin", "1px");
        tuile.css("position", "relative");
        tuile.height(height - 2);
        tuile.width(width - 2);


        /* Placement des numéros avec un peu de relief pour en améliorer la visibilité. */
        numero.css("color", "white");
        numero.css("text-shadow", "black 0.1em 0.1em 0.2em");
        numero.css("display", "block");
        numero.css("position", "absolute");
        /* Ce positionnement est le meilleur pour de grandes grilles du type 25 * 25. Ainsi les numéros ne déborderont
         * pas. */
        numero.css("top", "5%");
        numero.css("left", "5%");

        if ($("#affichage_num").is(':checked')) {
            numero.css("visibility", "visible");
        }
        else {
            numero.css("visibility", "hidden");
        }

        var percI = 0;
        var percJ = 0;
        for (i = 1; i < nb_lignes + 1; i++) {
            percJ = 0;
            for (j = 1; j < nb_col + 1; j++) {
                $(".ligne:nth-child(" + i + ") .tuile:nth-child(" + j + ")").css("background-position", -percJ + "px " + -percI + "px" );
                percJ += width;
            }
            percI += height;
        }

        // Si on a nb_lignes == 1 et que nb_col == 1, alors on affiche simplement une image.
        // Sinon on affiche une case grise dans la grille (celle tout en bas à droite)
        case_g = $("#case");
        if (case_g.length != 1 && (nb_lignes != 1 || nb_col != 1)) {
            $(".ligne:nth-child(" + (nb_lignes)  + ") .tuile:nth-child(" + (nb_col) + ")").attr("id", 'case');
            case_g = $("#case");
            case_g.css("background-color", "gray");
            case_g.css("background-image", "none");
            // Retirer le nombre de la case grise.
            case_g.find(".num").remove();
        }
    });


    $( window ).load(function() {
        alert("Après avoir affiché une image, tant que vous ne brassez pas les cartes, les commandes de déplacement seront gelées.");
        afficher.click();
    });


    $("#brasser").click(function brasse () {

        fin = false;
        score.text("0");

        // Si on a une image 1 * 1: ne rien faire.
        if (nb_lignes * nb_col == 1) {
            return;
        }
        // Si on a une image 2 * 1 ou 1 * 2: simplement swapper avec la dernière casse si cela n'a pas déjà été fait.
        else if (nb_lignes * nb_col == 2) {
            if (!$(".ligne:nth-child(" + 1  + ") .tuile:nth-child(" + 1 + ")").is("#case"))  {
                $(".ligne:nth-child(" + 1  + ") .tuile:nth-child(" + 1 + ")").swapWith($(".ligne:nth-child(" + nb_lignes  + ") .tuile:nth-child(" + nb_col + ")"));
            }
            return;
        }
        else {
            var previous_order = [];
            // Garder en mémmoire l'ordre précédent. On ne veut jamais reproduire un mélange que l'on a déjà
            // effectué
            for ( i = 1; i < nb_lignes + 1; i++) {
                for (j = 1; j < nb_col + 1; j++) {
                    previous_order.push(parseInt($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ") .num").text()));
                }
            }
        }

        /* Obtenir toutes les coordonnées possibles dans la grille: par exemple, pour 2 * 2 : (0,0) (0,1) (1,0) (1,1) */
        var coord = [];
        for (var i = 0; i < nb_lignes; i++) {
            for (var j = 0; j < nb_col; j++) {
                coord.push([i,j]);
            }
        }

        // On mélange ensuite de manière aléatoire ces coordonnées.
        coord = shuffle(coord);

        // On swappe ensuite chaque coordonnée dans l'ordre avec la coordonnée aléatoire obtenue
        var arr;
        for ( i = 1; i < nb_lignes + 1; i++) {
            for (j = 1; j < nb_col + 1; j++) {
                arr = coord.pop();
                arr[0] = arr[0] + 1;
                arr[1] = arr[1] + 1;
                $(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ")").swapWith($(".ligne:nth-child(" + arr[0]  + ") .tuile:nth-child(" + arr[1] + ")"));
            }
        }

        // Si on a mélangé de façon à ce que ce soit déjà une victoire, on brasse de nouveau. On effectue donc une vé-ri
        // fication de condition de victoire.
        var nb = 1;
        for (i = 1; i < nb_lignes + 1; i++) {
            for (j = 1; j < nb_col + 1; j++) {
                if (parseInt($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ") span").text()) == nb) {
                    nb++;
                }
            }
        }

        // Appel à brasse() si déjà une victoire.
        if ( (nb - 1) == (nb_col * nb_lignes - 1) && $(".ligne:nth-child(" + nb_lignes  + ") .tuile:nth-child(" + nb_col + ")").is($("#case"))) {
            brasse();
        }

        //  On vérifie ici que le brassage obtenu n'a pas déjà été obtenu précédemment. Sinon recommencer le brassage.
        var compteur = 0;
        nb = 0;
        for ( i = 1; i < nb_lignes + 1; i++) {
            for (j = 1; j < nb_col + 1; j++) {
                if (parseInt($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ") .num").text()) == previous_order[nb++]) {
                    compteur++;
                }
            }
        }

        // Alors l'ordre précédent a déjà été obtenue et donc on doit rebrasser (sinon l'usager aurait l'impression que
        // sa commande n'a été suivie d'aucun effet).
        if (compteur == (nb_col * nb_lignes - 1)) {
            brasse();
        }

    });

    $(document).on('click', '.tuile', function(e){
        /* Si la partie n'est pas commencée ou terminée, on ne peut pas effectuer de déplacements de la case grise.*/
        if (!fin) {
            /* Récupérer les coordonnées du clique. */
            var i = $(e.target.parentNode).index() + 1;
            var j = $(e.target).index() + 1;

            /* Vérification de la validité du déplacement. Si valide, on autorise le swap de <div> avec la #case */
            if ((i - 1) > 0
                && $(".ligne:nth-child(" + (i - 1)  + ") .tuile:nth-child(" + j + ")").is("#case")) {
                $("#case").swapWith($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ")"));
            }
            else if ((i + 1) < (nb_lignes + 1)
                && $(".ligne:nth-child(" + (i + 1)  + ") .tuile:nth-child(" + j + ")").is("#case")) {
                $("#case").swapWith($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ")"));
            }
            else if ((j - 1) > 0
                && $(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + (j - 1) + ")").is("#case")) {
                $("#case").swapWith($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ")"));
            }
            else if ((j + 1) < nb_col + 1
                && $(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + (j + 1) + ")").is("#case")) {
                $("#case").swapWith($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ")"));
            }
            else {
                return;
            }

            /* Incrémentation du score. */
            var score_int = parseInt(score.text()) + 1;
            score.text("");
            score.text(score_int);

            /* On vérifie après le déplacement effectué que la condition de victoire est remplie (tuiles rangées en
             * ordre décroissant <=> image reconstituée) */
            var nb = 1;
            for (i = 1; i < nb_lignes + 1; i++) {
                for (j = 1; j < nb_col + 1; j++) {
                    if (parseInt($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ") span").text()) == nb) {
                        nb++;
                    }
                }
            }

            /* Si l'image a été mise en ordre: dans ce cas, signifier la victoire. Fin de partie: interdire
            * tout déplacement tant que l'image source n'a pas été brassée. */
            if ( (nb - 1) == (nb_col * nb_lignes - 1)
                && $(".ligne:nth-child(" + nb_lignes  + ") .tuile:nth-child(" + nb_col + ")").is("#case") ) {
                window.alert("Vous avez gagné la partie en " + score.text() + " déplacements.\nBrassez " +
                    "de nouveau les tuiles pour rejouer à une nouvelle partie. Tant que vous ne brassez pas les tuiles, " +
                    "les commandes de déplacement seront gelées.");
                fin = true;
            }

        }
    });


    /* Essentiellement similaire à la fonction clique de #afficher */
    $(document).on('keydown', function(e) {

        if (!fin) {
            e = e || window.event;
            case_g = $("#case");
            var i = case_g.parent().index() + 1;
            var j = case_g.index() + 1;


            // Bas
            if (e.keyCode == '40' && (i - 1) > 0) {
                case_g.swapWith($(".ligne:nth-child(" + (i - 1)  + ") .tuile:nth-child(" + j + ")"));
            }
            // Haut
            else if (e.keyCode == '38' && (i + 1) < (nb_lignes + 1)) {
                case_g.swapWith($(".ligne:nth-child(" + (i + 1)  + ") .tuile:nth-child(" + j + ")"));
            }
            // Droite
            else if (e.keyCode == '39' && (j - 1) > 0) {
                case_g.swapWith($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + (j - 1) + ")"));
            }
            // Gauche
            else if (e.keyCode == '37' && (j + 1) < nb_col + 1) {
                case_g.swapWith($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + (j + 1) + ")"));
            }
            else {
                return; // Interdire le déplacement
            }

            /* Mise à jour du score. */
            var score_int = parseInt(score.text()) + 1;
            score.text("");
            score.text(score_int);

            // Si on a mélangé de façon à ce que ce soit déjà une victoire, on brasse de nouveau.
            var nb = 1;
            for (i = 1; i < nb_lignes + 1; i++) {
                for (j = 1; j < nb_col + 1; j++) {
                    if (parseInt($(".ligne:nth-child(" + i  + ") .tuile:nth-child(" + j + ") span").text()) == nb) {
                        nb++;
                    }
                }
            }

            if ( (nb - 1) == (nb_col * nb_lignes - 1)
                && $(".ligne:nth-child(" + nb_lignes  + ") .tuile:nth-child(" + nb_col + ")").is("#case")) {
                window.alert("Vous avez gagné la partie en " + score.text() + " déplacements.\nBrassez " +
                    "de nouveau les tuiles pour rejouer à une nouvelle partie. Tant que vous ne brassez " +
                    "pas les tuiles, les commandes de déplacement seront gelées.");
                fin = true;
            }
        }
    });

});