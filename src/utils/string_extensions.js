// eslint-disable-next-line no-extend-native
String.prototype.toTitleCase = function() {
      const capitalizedString = this.split('_').map(word => 
         word[0].toUpperCase().concat(word.slice(1))
      ).join(' ');
      return capitalizedString;
    }