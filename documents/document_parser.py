# -*- encoding:utf-8 -*-
import re


class MyException(Exception):
    pass


class DocumentParser:
    def __init__(self, filepath):
        self.uploaded_file = filepath

    def csv_parser(self):
        print self.uploaded_file
        f = open(self.uploaded_file, 'r')
        data = f.read()
        f.close()
        """
        http://www.kimgentes.com/worshiptech-web-tools-page/2008/10/14/regex-pattern-for-parsing-csv-files-with-embedded-commas-dou.html

        ("(?:[^"]|"")*"|[^,]*)*(,("(?:[^"]|"")*"|[^,]*))
        """
        pattern = re.compile(r'^(("(?:[^"]|"")*"|[^,]*)(,("(?:[^"]|"")*"|[^,]*))*)$', re.MULTILINE)

        """
        for match in pattern.finditer(data):
            print match.groups()[0]
        """

        documents = []

        offset = 0
        name = []
        text = []
        buffer = []
        is_name = True
        is_in_quote = False


        documentIndex = 0

        document = {"id": "fcd75360-24b5-11e7-8573-0bfe8b3d9ea9-1"
            , "name": None
            , "text": None
            , "status": "READY"
            , "modifiedDate": 1492574970774}

        documents.append(document)


        """에라 모르겠다...정규식은 실패임"""
        try:
            length = len(data)
            for char in data:



                if is_name:
                    if char == ",":
                        documents[documentIndex]["name"] = ''.join(buffer)
                        buffer = []
                        is_name = False
                        print documents[documentIndex]["name"]
                    else:
                        buffer.append(char)

                else:
                    if is_in_quote:
                        if char == '"':
                            if offset + 1 < length and data[offset + 1] == '"':
                                buffer.append(char)
                                buffer.append(data[offset + 1])
                                char.next()

                            else:
                                print buffer
                                documents[documentIndex]["text"] = ''.join(buffer)
                                buffer = []
                                is_name = True
                                print documents[documentIndex]["text"]
                                documents.append(document)
                                documentIndex+=1

                        else:
                            buffer.append(char)

                    else:
                        if char == '"':
                            is_in_quote = True
                        else:
                            if char == " " or char == "\t":
                                pass
                            else:
                                raise MyException("wrong document format")

                offset += 1





        except MyException as e:
            print(e.args[0])
        except Exception as e:
            print (e.args[0])
